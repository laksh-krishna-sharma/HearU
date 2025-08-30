from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict

from app.services.voice_session_response.voice_session_response import (
    VoiceSessionResponseService,
)
from app.utilities.db import get_db
from app.routes.auth.auth import get_current_user
from app.models.user import User
from app.routes.voice_session_response.schema.voice_session_response import (
    VoiceSessionResponseCreateRequest,
    VoiceSessionResponseUpdateRequest,
    VoiceSessionResponseResponse,
    VoiceSessionResponseListResponse,
)

router = APIRouter(
    prefix="/api/voice-session-responses", tags=["Voice Session Responses"]
)


@router.post("/", response_model=VoiceSessionResponseResponse)
async def create_voice_session_response(
    payload: VoiceSessionResponseCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionResponseResponse:
    """Create a new voice session response record."""
    service = VoiceSessionResponseService(db)
    return await service.create_response(payload, current_user)


@router.get("/", response_model=VoiceSessionResponseListResponse)
async def list_voice_session_responses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionResponseListResponse:
    """List all voice session responses for the current user."""
    service = VoiceSessionResponseService(db)
    responses = await service.list_responses(current_user)
    return VoiceSessionResponseListResponse(responses=responses)


@router.get("/{response_id}", response_model=VoiceSessionResponseResponse)
async def get_voice_session_response(
    response_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionResponseResponse:
    """Get a specific voice session response by ID."""
    service = VoiceSessionResponseService(db)
    response = await service.get_response(response_id, current_user)
    if not response:
        raise HTTPException(status_code=404, detail="Voice session response not found")
    return response


@router.get("/session/{session_id}", response_model=VoiceSessionResponseListResponse)
async def get_voice_session_responses_by_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionResponseListResponse:
    """Get all voice session responses for a specific session."""
    service = VoiceSessionResponseService(db)
    responses = await service.get_responses_by_session(session_id, current_user)
    return VoiceSessionResponseListResponse(responses=responses)


@router.put("/{response_id}", response_model=VoiceSessionResponseResponse)
async def update_voice_session_response(
    response_id: str,
    payload: VoiceSessionResponseUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> VoiceSessionResponseResponse:
    """Update a voice session response."""
    service = VoiceSessionResponseService(db)
    response = await service.update_response(response_id, payload, current_user)
    if not response:
        raise HTTPException(status_code=404, detail="Voice session response not found")
    return response


@router.delete("/{response_id}")
async def delete_voice_session_response(
    response_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Delete a voice session response."""
    service = VoiceSessionResponseService(db)
    success = await service.delete_response(response_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Voice session response not found")
    return {"status": "deleted"}
