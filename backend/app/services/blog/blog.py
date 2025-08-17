from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.blog import Blog
from models.user import User


async def create_blog(
    db: AsyncSession,
    *,
    user: User,
    title: str,
    content: str,
    tags: Optional[List[str]] = None,
) -> Blog:
    tags_str = ",".join([t.strip() for t in tags]) if tags else None
    blog = Blog(user_id=user.id, title=title, content=content, tags=tags_str)
    db.add(blog)
    await db.commit()
    await db.refresh(blog)
    return blog


async def get_blog(db: AsyncSession, blog_id: str) -> Optional[Blog]:
    stmt = select(Blog).options(selectinload(Blog.user)).where(Blog.id == blog_id)
    res = await db.execute(stmt)
    return res.scalar_one_or_none()


async def list_blogs(
    db: AsyncSession,
    *,
    skip: int = 0,
    limit: int = 10,
    q: Optional[str] = None,
) -> Tuple[List[Blog], int]:
    stmt = select(Blog).options(selectinload(Blog.user)).order_by(Blog.created_at.desc())
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where((Blog.title.ilike(pattern)) | (Blog.content.ilike(pattern)))
    total_stmt = select(func.count()).select_from(stmt.subquery())
    res = await db.execute(stmt.offset(skip).limit(limit))
    items = res.scalars().all()
    total_res = await db.execute(total_stmt)
    total = total_res.scalar_one()
    return items, int(total)


async def update_blog(
    db: AsyncSession,
    *,
    blog_id: str,
    user: User,
    title: Optional[str] = None,
    content: Optional[str] = None,
    tags: Optional[List[str]] = None,
) -> Optional[Blog]:
    blog = await get_blog(db, blog_id)
    if not blog:
        return None
    # ownership check: allow admin as well
    if blog.user_id != user.id and not user.is_admin:
        raise PermissionError("Not allowed to edit this blog")

    updated = False
    if title is not None:
        blog.title = title
        updated = True
    if content is not None:
        blog.content = content
        updated = True
    if tags is not None:
        blog.tags = ",".join([t.strip() for t in tags]) if tags else None
        updated = True

    if updated:
        db.add(blog)
        await db.commit()
        await db.refresh(blog)

    return blog


async def delete_blog(db: AsyncSession, *, blog_id: str, user: User) -> bool:
    blog = await get_blog(db, blog_id)
    if not blog:
        return False
    if blog.user_id != user.id and not user.is_admin:
        raise PermissionError("Not allowed to delete this blog")
    await db.delete(blog)
    await db.commit()
    return True


async def get_user_blogs(
    db: AsyncSession, *, user_id: str, skip: int = 0, limit: int = 10
) -> List[Blog]:
    stmt = select(Blog).where(Blog.user_id == user_id).order_by(Blog.created_at.desc())
    res = await db.execute(stmt.offset(skip).limit(limit))
    items = res.scalars().all()
    return items
