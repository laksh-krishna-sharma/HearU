from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class JournalBase(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = None
    entry_date: datetime


class JournalCreate(JournalBase):
    pass


class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    entry_date: Optional[datetime] = None


class JournalOut(JournalBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]
    author_name: Optional[str]

    class Config:
        from_attributes = True


class VoiceSessionNotes(BaseModel):
    """Schema for voice session notes and summary"""

    session_id: str
    status: str
    summary: Optional[str] = None
    notes_content: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class JournalWithNotesOut(JournalOut):
    """Journal with associated voice session notes"""

    voice_session_notes: Optional[VoiceSessionNotes] = None
