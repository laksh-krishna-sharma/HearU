from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from sqlalchemy.ext.asyncio import AsyncSession

from utilities.db import get_db

# reuse auth dependency from your existing auth router
from routes.auth.auth import get_current_user
from models.user import User
from services.blog.blog import (
    create_blog,
    get_blog,
    list_blogs,
    update_blog,
    delete_blog,
)
from routes.blog.schema.blog import BlogCreate, BlogUpdate, BlogOut

router = APIRouter(prefix="/api/blogs", tags=["blogs"])


@router.post("", response_model=BlogOut, status_code=status.HTTP_201_CREATED)
async def create_blog_endpoint(
    payload: BlogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BlogOut:
    blog = await create_blog(
        db,
        user=current_user,
        title=payload.title,
        content=payload.content,
        tags=payload.tags,
    )
    out = BlogOut(
        id=blog.id,
        user_id=blog.user_id,
        title=blog.title,
        content=blog.content,
        tags=blog.tags.split(",") if blog.tags else [],
        created_at=blog.created_at,
        updated_at=blog.updated_at,
        author_name=current_user.name or current_user.username,
    )
    return out


@router.get("", response_model=List[BlogOut])
async def list_blogs_endpoint(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    q: Optional[str] = Query(None),
) -> List[BlogOut]:
    items, total = await list_blogs(db, skip=skip, limit=limit, q=q)
    out = []
    for b in items:
        author_name = None
        if b.user:
            author_name = b.user.name or b.user.username
        out.append(
            BlogOut(
                id=b.id,
                user_id=b.user_id,
                title=b.title,
                content=b.content,
                tags=b.tags.split(",") if b.tags else [],
                created_at=b.created_at,
                updated_at=b.updated_at,
                author_name=author_name,
            )
        )
    return out


@router.get("/{blog_id}", response_model=BlogOut)
async def get_blog_endpoint(
    blog_id: str, db: AsyncSession = Depends(get_db)
) -> BlogOut:
    blog = await get_blog(db, blog_id)
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found"
        )
    author_name = None
    if blog.user:
        author_name = blog.user.name or blog.user.username
    return BlogOut(
        id=blog.id,
        user_id=blog.user_id,
        title=blog.title,
        content=blog.content,
        tags=blog.tags.split(",") if blog.tags else [],
        created_at=blog.created_at,
        updated_at=blog.updated_at,
        author_name=author_name,
    )


@router.put("/{blog_id}", response_model=BlogOut)
async def update_blog_endpoint(
    blog_id: str,
    payload: BlogUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BlogOut:
    try:
        blog = await update_blog(
            db,
            blog_id=blog_id,
            user=current_user,
            title=payload.title,
            content=payload.content,
            tags=payload.tags,
        )
    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found"
        )
    return BlogOut(
        id=blog.id,
        user_id=blog.user_id,
        title=blog.title,
        content=blog.content,
        tags=blog.tags.split(",") if blog.tags else [],
        created_at=blog.created_at,
        updated_at=blog.updated_at,
        author_name=current_user.name or current_user.username,
    )


@router.delete("/{blog_id}", status_code=status.HTTP_200_OK)
async def delete_blog_endpoint(
    blog_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    try:
        ok = await delete_blog(db, blog_id=blog_id, user=current_user)
    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found"
        )
    return {"message": "Blog deleted"}
