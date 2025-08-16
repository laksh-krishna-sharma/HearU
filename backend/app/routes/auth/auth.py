from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional, List, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from utilities.db import get_db
from services.auth.auth import (
    register_user,
    authenticate_user,
    create_default_admin_if_missing,
)
from utilities.jwt import create_access_token, decode_token, revoke_jti
from models.user import User
from routes.auth.schema.auth import RegisterRequest, LoginRequest, UserOut

router = APIRouter(prefix="/api", tags=["auth"])


# ----- helper dependencies -----
async def get_current_user(
    authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)
) -> User:
    """
    Read Authorization: Bearer <token>, decode token, return User instance.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header",
        )

    token = parts[1]
    try:
        payload = decode_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token error: {str(e)}"
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    user._token_jti = payload.get("jti")
    return user


async def admin_required(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required"
        )
    return user


# ----- endpoints -----
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    req: RegisterRequest, db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    try:
        user = await register_user(
            db,
            name=req.name,
            email=req.email,
            password=req.password,
            username=req.username,
            age=req.age,
            gender=req.gender,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "message": "User registered successfully",
        "user": UserOut(**user.to_dict()),
    }


@router.post("/login")
async def login(
    req: LoginRequest, db: AsyncSession = Depends(get_db)
) -> dict[str, Any]:
    user = await authenticate_user(db, req.email, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    token = create_access_token(identity=str(user.id))
    return {
        "access_token": token,
        "message": "Login successful",
        "user": UserOut(**user.to_dict()),
    }


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)) -> dict[str, str]:
    jti = getattr(current_user, "_token_jti", None)
    if not jti:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Token jti not available"
        )
    revoke_jti(jti)
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut(**current_user.to_dict())


@router.get("/admin/users", response_model=List[UserOut])
async def list_users(
    admin: User = Depends(admin_required), db: AsyncSession = Depends(get_db)
) -> List[UserOut]:
    stmt = select(User).where(User.is_admin.is_(False))
    res = await db.execute(stmt)
    users = res.scalars().all()
    return [UserOut(**u.to_dict()) for u in users]


@router.post("/setup/create-default-admin", status_code=status.HTTP_201_CREATED)
async def ensure_admin(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    admin = await create_default_admin_if_missing(db)
    return {"message": "Default admin ensured", "admin": admin.to_dict()}
