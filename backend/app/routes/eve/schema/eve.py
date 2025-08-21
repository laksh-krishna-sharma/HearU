from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


# -------------------- Journal --------------------

class JournalBase(BaseModel):
    title: str
    content: str


class JournalCreateRequest(JournalBase):
    pass


class JournalUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class JournalResponse(JournalBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JournalListResponse(BaseModel):
    journals: List[JournalResponse]


class JournalEveRequest(BaseModel):
    journal_id: str


class JournalEveResponse(BaseModel):
    message_id: str
    text: str
    audio_path: Optional[str]
    created_at: datetime


# -------------------- Voice Session --------------------

class VoiceSessionStartRequest(BaseModel):
    system_prompt: str


class VoiceSessionStartResponse(BaseModel):
    session_id: str
    system_prompt: str
    is_active: bool
    created_at: datetime


class VoiceSessionTurnRequest(BaseModel):
    session_id: str


class VoiceSessionTurnResponse(BaseModel):
    user_message_id: str
    eve_message_id: str
    user_text: str
    eve_text: str
    audio_path: Optional[str]
    created_at: datetime


class VoiceSessionEndRequest(BaseModel):
    session_id: str
    save_summary: Optional[bool] = False


class VoiceSessionEndResponse(BaseModel):
    session_id: str
    status: str
    summary: Optional[str] = None


# -------------------- Voice Session CRUD --------------------

class VoiceSessionResponse(BaseModel):
    id: str
    user_id: str
    system_prompt: str
    is_active: bool
    created_at: datetime
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VoiceSessionListResponse(BaseModel):
    sessions: List[VoiceSessionResponse]


# -------------------- Eve Message --------------------

class EveMessageCreateRequest(BaseModel):
    text: str
    role: str = "eve"


class EveMessageUpdateRequest(BaseModel):
    text: Optional[str] = None


class EveMessageResponse(BaseModel):
    id: str
    user_id: str
    journal_id: Optional[str] = None
    session_id: Optional[str] = None
    role: str
    text: str
    audio_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
