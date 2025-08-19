from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from utilities.db import get_db
from routes.auth.auth import get_current_user
from models.user import User
from services.journal.journal import (
    create_journal,
    get_journal,
    list_journals,
    update_journal,
    delete_journal,
)
from routes.journal.schema.journal import JournalCreate, JournalUpdate, JournalOut

router = APIRouter(prefix="/api/journals", tags=["journals"])


@router.post("", response_model=JournalOut, status_code=status.HTTP_201_CREATED)
async def create_journal_endpoint(
    payload: JournalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JournalOut:
    journal = await create_journal(
        db,
        user=current_user,
        title=payload.title,
        content=payload.content,
        tags=payload.tags,
        entry_date=payload.entry_date,
    )
    return JournalOut(
        id=journal.id,
        user_id=journal.user_id,
        title=journal.title,
        content=journal.content,
        tags=journal.tags.split(",") if journal.tags else [],
        entry_date=journal.entry_date,
        created_at=journal.created_at,
        updated_at=journal.updated_at,
        author_name=current_user.name or current_user.username,
    )


@router.get("", response_model=List[JournalOut])
async def list_journals_endpoint(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    q: Optional[str] = Query(None),
) -> List[JournalOut]:
    items, total = await list_journals(db, skip=skip, limit=limit, q=q)
    out = []
    for j in items:
        author_name = None
        if j.user:
            author_name = j.user.name or j.user.username
        out.append(
            JournalOut(
                id=j.id,
                user_id=j.user_id,
                title=j.title,
                content=j.content,
                tags=j.tags.split(",") if j.tags else [],
                entry_date=j.entry_date,
                created_at=j.created_at,
                updated_at=j.updated_at,
                author_name=author_name,
            )
        )
    return out


@router.get("/{journal_id}", response_model=JournalOut)
async def get_journal_endpoint(
    journal_id: str, db: AsyncSession = Depends(get_db)
) -> JournalOut:
    journal = await get_journal(db, journal_id)
    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found"
        )
    author_name = None
    if journal.user:
        author_name = journal.user.name or journal.user.username
    return JournalOut(
        id=journal.id,
        user_id=journal.user_id,
        title=journal.title,
        content=journal.content,
        tags=journal.tags.split(",") if journal.tags else [],
        entry_date=journal.entry_date,
        created_at=journal.created_at,
        updated_at=journal.updated_at,
        author_name=author_name,
    )


@router.put("/{journal_id}", response_model=JournalOut)
async def update_journal_endpoint(
    journal_id: str,
    payload: JournalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JournalOut:
    try:
        journal = await update_journal(
            db,
            journal_id=journal_id,
            user=current_user,
            title=payload.title,
            content=payload.content,
            tags=payload.tags,
            entry_date=payload.entry_date,
        )
    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found"
        )
    return JournalOut(
        id=journal.id,
        user_id=journal.user_id,
        title=journal.title,
        content=journal.content,
        tags=journal.tags.split(",") if journal.tags else [],
        entry_date=journal.entry_date,
        created_at=journal.created_at,
        updated_at=journal.updated_at,
        author_name=current_user.name or current_user.username,
    )


@router.delete("/{journal_id}", status_code=status.HTTP_200_OK)
async def delete_journal_endpoint(
    journal_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    try:
        ok = await delete_journal(db, journal_id=journal_id, user=current_user)
    except PermissionError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found"
        )
    return {"message": "Journal deleted"}
