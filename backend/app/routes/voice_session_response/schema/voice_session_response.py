from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class VoiceSessionResponseCreateRequest(BaseModel):
    """Request schema for creating a voice session response record"""

    session_id: str
    status: str
    summary: Optional[str] = None
    notes_journal_id: Optional[str] = None
    notes_content: Optional[str] = None


class VoiceSessionResponseUpdateRequest(BaseModel):
    """Request schema for updating a voice session response record"""

    status: Optional[str] = None
    summary: Optional[str] = None
    notes_journal_id: Optional[str] = None
    notes_content: Optional[str] = None


class VoiceSessionResponseResponse(BaseModel):
    """Response schema for voice session response data"""

    id: str
    user_id: str
    session_id: str
    status: str
    summary: Optional[str] = None
    notes_journal_id: Optional[str] = None
    notes_content: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VoiceSessionResponseListResponse(BaseModel):
    """Response schema for listing voice session responses"""

    responses: List[VoiceSessionResponseResponse]
