from typing import Optional, List, Tuple
from datetime import datetime
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.journal import Journal
from app.models.user import User


async def create_journal(
    db: AsyncSession,
    *,
    user: User,
    title: str,
    content: str,
    tags: Optional[List[str]] = None,
    entry_date: Optional[datetime] = None,
) -> Journal:
    tags_str = ",".join([t.strip() for t in tags]) if tags else None
    journal = Journal(
        user_id=user.id,
        title=title,
        content=content,
        tags=tags_str,
        entry_date=entry_date or datetime.utcnow(),
    )
    db.add(journal)
    await db.commit()
    await db.refresh(journal)
    return journal


async def get_journal(db: AsyncSession, journal_id: str) -> Optional[Journal]:
    stmt = (
        select(Journal)
        .options(selectinload(Journal.user))
        .where(Journal.id == journal_id)
    )
    res = await db.execute(stmt)
    return res.scalar_one_or_none()


async def list_journals(
    db: AsyncSession,
    *,
    skip: int = 0,
    limit: int = 10,
    q: Optional[str] = None,
    user_id: Optional[str] = None,
) -> Tuple[List[Journal], int]:
    stmt = (
        select(Journal)
        .options(selectinload(Journal.user))
        .order_by(desc(Journal.created_at))
    )

    if user_id:
        stmt = stmt.where(Journal.user_id == user_id)

    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(
            (getattr(Journal.title, "ilike")(pattern))
            | (getattr(Journal.content, "ilike")(pattern))
        )

    total_stmt = select(func.count()).select_from(stmt.subquery())
    res = await db.execute(stmt.offset(skip).limit(limit))
    items = res.scalars().all()

    total_res = await db.execute(total_stmt)
    total = total_res.scalar_one()

    return items, int(total)


async def update_journal(
    db: AsyncSession,
    *,
    journal_id: str,
    user: User,
    title: Optional[str] = None,
    content: Optional[str] = None,
    tags: Optional[List[str]] = None,
    entry_date: Optional[datetime] = None,
) -> Optional[Journal]:
    journal = await get_journal(db, journal_id)
    if not journal:
        return None

    # ownership check
    if journal.user_id != user.id and not user.is_admin:
        raise PermissionError("Not allowed to edit this journal")

    updated = False
    if title is not None:
        journal.title = title
        updated = True
    if content is not None:
        journal.content = content
        updated = True
    if tags is not None:
        journal.tags = ",".join([t.strip() for t in tags]) if tags else None
        updated = True
    if entry_date is not None:
        journal.entry_date = entry_date
        updated = True

    if updated:
        db.add(journal)
        await db.commit()
        await db.refresh(journal)

    return journal


async def delete_journal(db: AsyncSession, *, journal_id: str, user: User) -> bool:
    journal = await get_journal(db, journal_id)
    if not journal:
        return False

    if journal.user_id != user.id and not user.is_admin:
        raise PermissionError("Not allowed to delete this journal")

    await db.delete(journal)
    await db.commit()
    return True


async def get_user_journals(
    db: AsyncSession, *, user_id: str, skip: int = 0, limit: int = 10
) -> List[Journal]:
    stmt = (
        select(Journal)
        .where(Journal.user_id == user_id)
        .order_by(desc(Journal.created_at))
    )
    res = await db.execute(stmt.offset(skip).limit(limit))
    return res.scalars().all()
