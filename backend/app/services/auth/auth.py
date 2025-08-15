import os
from datetime import datetime, timedelta
from typing import Optional

import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from utilities.db import get_db
from models.user import User

JWT_SECRET = os.environ.get("JWT_SECRET", "@123#")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRE_HOURS", "24"))

# In-memory revoked jti store (ephemeral)
# For multi-worker, persist to Redis/DB instead.
BLACKLIST = set()


def _make_jti() -> str:
    import uuid
    return str(uuid.uuid4())


def create_access_token(identity: str) -> str:
    """
    Create a JWT with 'sub' and 'jti' claims and expiry.
    Returns a string token.
    """
    now = datetime.utcnow()
    exp = now + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    jti = _make_jti()
    payload = {
        "sub": str(identity),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "jti": jti,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token: str) -> dict:
    """
    Decode and verify token. Raises jwt exceptions on invalid/expired token.
    Also checks blacklist.
    """
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    jti = payload.get("jti")
    if jti in BLACKLIST:
        raise jwt.InvalidTokenError("Token revoked")
    return payload


def revoke_jti(jti: str):
    BLACKLIST.add(jti)


# ----------------- async DB service functions -----------------
async def create_default_admin_if_missing(db: AsyncSession) -> User:
    """
    Create a default admin user if it doesn't exist.
    Use environment variables to configure credentials for production.
    """
    admin_email = os.environ.get("DEFAULT_ADMIN_EMAIL", "23f3002362@ds.study.iitm.ac.in")
    stmt = select(User).filter_by(email=admin_email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if user:
        return user

    admin = User(
        name=os.environ.get("DEFAULT_ADMIN_NAME", "Laksh Krishna Sharma"),
        email=admin_email,
        username=os.environ.get("DEFAULT_ADMIN_USERNAME", "admin"),
        is_admin=True
    )
    admin.set_password(os.environ.get("DEFAULT_ADMIN_PASSWORD", "admin123"))
    db.add(admin)
    await db.commit()
    await db.refresh(admin)
    return admin


async def register_user(
    db: AsyncSession,
    *,
    name: str,
    email: str,
    password: str,
    username: Optional[str] = None,
    age: Optional[int] = None,
    gender: Optional[str] = None,
) -> User:
    """
    Register a new user. Raises ValueError on duplicate email/username.
    """
    res = await db.execute(select(User).filter_by(email=email))
    existing = res.scalar_one_or_none()
    if existing:
        raise ValueError("Email already exists")

    if username:
        res2 = await db.execute(select(User).filter_by(username=username))
        if res2.scalar_one_or_none():
            raise ValueError("Username already exists")

    user = User(name=name, email=email, username=username, age=age, gender=gender)
    user.set_password(password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    """
    Return the User if authentication succeeds, else None.
    """
    res = await db.execute(select(User).filter_by(email=email))
    user = res.scalar_one_or_none()
    if user and user.verify_password(password):
        return user
    return None
