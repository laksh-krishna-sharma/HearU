from typing import Optional, List
from pydantic import BaseModel


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
    id: int

    class Config:
        from_attributes = True


class JournalListResponse(BaseModel):
    journals: List[JournalResponse]


class JournalEveRequest(BaseModel):
    journal_id: int


class JournalEveResponse(BaseModel):
    message_id: int
    text: str
    audio_url: Optional[str]


# -------------------- Voice Session --------------------

class VoiceSessionStartRequest(BaseModel):
    system_prompt: str


class VoiceSessionStartResponse(BaseModel):
    session_id: int
    system_prompt: str


class VoiceSessionTurnRequest(BaseModel):
    session_id: int
    audio_file: str  # path or upload reference


class VoiceSessionTurnResponse(BaseModel):
    message_id: int
    text: str
    audio_url: Optional[str]


class VoiceSessionEndRequest(BaseModel):
    session_id: int


class VoiceSessionEndResponse(BaseModel):
    session_id: int
    status: str


# -------------------- Voice Session CRUD --------------------

class VoiceSessionResponse(BaseModel):
    id: int
    system_prompt: str
    is_active: bool

    class Config:
        from_attributes = True


class VoiceSessionListResponse(BaseModel):
    sessions: List[VoiceSessionResponse]
