from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict

from app.services.eve.eve import EveService
from app.utilities.db import get_db
from app.routes.auth.auth import get_current_user
from app.models.user import User
from app.routes.eve.schema.eve import (
    JournalEveRequest,
    JournalEveResponse,
    VoiceSessionStartRequest,
    VoiceSessionStartResponse,
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

router = APIRouter(prefix="/api/eve", tags=["Eve"])


# --- Journal Reply (Feature A) ---
@router.post("/journal-reply", response_model=JournalEveResponse)
async def journal_reply(
    payload: JournalEveRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JournalEveResponse:
    """Generate Eve's supportive voice reply to a journal entry."""
    service = EveService(db)
    reply = await service.journal_reply(payload.journal_id, current_user)
    if not reply:
        raise HTTPException(status_code=404, detail="Journal not found")
    return reply


# --- Voice Session (Feature B) ---
@router.post("/voice/start", response_model=VoiceSessionStartResponse)
async def start_voice_session(
    payload: VoiceSessionStartRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionStartResponse:
    """Start a new interactive voice session with Eve."""
    service = EveService(db)
    return await service.start_voice_session(payload.system_prompt, current_user)


@router.post("/voice/turn/{session_id}", response_model=VoiceSessionTurnResponse)
async def voice_turn(
    session_id: str,
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionTurnResponse:
    """Process a voice turn in an active session."""
    service = EveService(db)
    audio_bytes = await audio.read()
    result = await service.voice_turn(session_id, audio_bytes, current_user)
    if not result:
        raise HTTPException(status_code=404, detail="Session not found or inactive")
    return result


@router.post("/voice/end", response_model=VoiceSessionEndResponse)
async def end_voice_session(
    payload: VoiceSessionEndRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionEndResponse:
    """End a voice session with optional summarization."""
    service = EveService(db)
    result = await service.end_voice_session(
        payload.session_id,
        current_user,
        payload.save_summary or False,  # ensure strict bool
    )
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")
    return result


# --- Journal CRUD ---
@router.get("/journals", response_model=List[JournalResponse])
async def list_journals(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[JournalResponse]:
    """List user's journals."""
    service = EveService(db)
    return await service.list_journals(current_user)


@router.get("/journals/{journal_id}", response_model=JournalResponse)
async def get_journal(
    journal_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JournalResponse:
    """Get a specific journal."""
    service = EveService(db)
    journal = await service.get_journal(journal_id, current_user)
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    return journal


@router.post("/journals", response_model=JournalResponse)
async def create_journal(
    payload: JournalCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JournalResponse:
    """Create a new journal."""
    service = EveService(db)
    return await service.create_journal(payload, current_user)


@router.put("/journals/{journal_id}", response_model=JournalResponse)
async def update_journal(
    journal_id: str,
    payload: JournalUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> JournalResponse:
    """Update a journal."""
    service = EveService(db)
    journal = await service.update_journal(journal_id, payload, current_user)
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    return journal


@router.delete("/journals/{journal_id}")
async def delete_journal(
    journal_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Delete a journal."""
    service = EveService(db)
    success = await service.delete_journal(journal_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Journal not found")
    return {"status": "deleted"}


# --- EveMessage CRUD ---
@router.get("/journals/{journal_id}/messages", response_model=List[EveMessageResponse])
async def list_messages(
    journal_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[EveMessageResponse]:
    """List messages for a journal."""
    service = EveService(db)
    return await service.list_messages(journal_id, current_user)


@router.post("/journals/{journal_id}/messages", response_model=EveMessageResponse)
async def create_message(
    journal_id: str,
    payload: EveMessageCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EveMessageResponse:
    """Create a new message."""
    service = EveService(db)
    return await service.create_message(journal_id, payload, current_user)


@router.put("/messages/{message_id}", response_model=EveMessageResponse)
async def update_message(
    message_id: str,
    payload: EveMessageUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EveMessageResponse:
    """Update a message."""
    service = EveService(db)
    message = await service.update_message(message_id, payload, current_user)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message


@router.delete("/messages/{message_id}")
async def delete_message(
    message_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Delete a message."""
    service = EveService(db)
    success = await service.delete_message(message_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"status": "deleted"}
