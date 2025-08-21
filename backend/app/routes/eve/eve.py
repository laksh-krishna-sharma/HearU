from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from services.eve.eve import EveService
from utilities.db import get_db
from routes.eve.schema.eve import (
    JournalEveRequest,
    JournalEveResponse,
    VoiceSessionStartRequest,
    VoiceSessionStartResponse,
    VoiceSessionTurnRequest,
    VoiceSessionTurnResponse,
    VoiceSessionEndRequest,
    VoiceSessionEndResponse,
    JournalCreateRequest,
    JournalUpdateRequest,
    JournalResponse,
    EveMessageCreateRequest,
    EveMessageUpdateRequest,
    EveMessageResponse,
)

router = APIRouter(prefix="/eve", tags=["Eve"])

# --- Journal Reply ---
@router.post("/journal-reply", response_model=JournalEveResponse)
async def journal_reply(payload: JournalEveRequest, db: AsyncSession = Depends(get_db)):
    service = EveService(db)
    reply = await service.journal_reply(payload.journal_id)
    if not reply:
        raise HTTPException(status_code=404, detail="Journal not found")
    return reply


# --- Voice Session ---
@router.post("/voice/start", response_model=VoiceSessionStartResponse)
async def start_voice_session(payload: VoiceSessionStartRequest, db: AsyncSession = Depends(get_db)):
    service = EveService(db)
    return await service.start_voice_session(payload.system_prompt)


@router.post("/voice/turn", response_model=VoiceSessionTurnResponse)
async def voice_turn(
    session_id: int,
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    service = EveService(db)
    audio_bytes = await audio.read()
    return await service.voice_turn(session_id, audio_bytes)


@router.post("/voice/end", response_model=VoiceSessionEndResponse)
async def end_voice_session(payload: VoiceSessionEndRequest, db: AsyncSession = Depends(get_db)):
    service = EveService(db)
    return await service.end_voice_session(payload.session_id)


# --- Journal CRUD ---
@router.get("/journals", response_model=List[JournalResponse])
async def list_journals(db: AsyncSession = Depends(get_db)):
    return await EveService(db).list_journals()


@router.get("/journals/{journal_id}", response_model=JournalResponse)
async def get_journal(journal_id: int, db: AsyncSession = Depends(get_db)):
    journal = await EveService(db).get_journal(journal_id)
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    return journal


@router.post("/journals", response_model=JournalResponse)
async def create_journal(payload: JournalCreateRequest, db: AsyncSession = Depends(get_db)):
    return await EveService(db).create_journal(payload)


@router.put("/journals/{journal_id}", response_model=JournalResponse)
async def update_journal(journal_id: int, payload: JournalUpdateRequest, db: AsyncSession = Depends(get_db)):
    return await EveService(db).update_journal(journal_id, payload)


@router.delete("/journals/{journal_id}")
async def delete_journal(journal_id: int, db: AsyncSession = Depends(get_db)):
    await EveService(db).delete_journal(journal_id)
    return {"status": "deleted"}


# --- EveMessage CRUD ---
@router.get("/journals/{journal_id}/messages", response_model=List[EveMessageResponse])
async def list_messages(journal_id: int, db: AsyncSession = Depends(get_db)):
    return await EveService(db).list_messages(journal_id)


@router.post("/journals/{journal_id}/messages", response_model=EveMessageResponse)
async def create_message(journal_id: int, payload: EveMessageCreateRequest, db: AsyncSession = Depends(get_db)):
    return await EveService(db).create_message(journal_id, payload)


@router.put("/messages/{message_id}", response_model=EveMessageResponse)
async def update_message(message_id: int, payload: EveMessageUpdateRequest, db: AsyncSession = Depends(get_db)):
    return await EveService(db).update_message(message_id, payload)


@router.delete("/messages/{message_id}")
async def delete_message(message_id: int, db: AsyncSession = Depends(get_db)):
    await EveService(db).delete_message(message_id)
    return {"status": "deleted"}
