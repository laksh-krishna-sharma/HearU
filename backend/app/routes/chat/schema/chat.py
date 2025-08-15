from typing import List, Optional

from pydantic import BaseModel


class CreateSessionRequest(BaseModel):
    title: Optional[str] = None


class SessionOut(BaseModel):
    session_id: int
    user_id: Optional[str] = None
    title: Optional[str] = None


class SendMessageRequest(BaseModel):
    text: str


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: str


class ChatHistoryResponse(BaseModel):
    session_id: int
    messages: List[MessageOut]


class AgentRequest(BaseModel):
    text: str
    session_id: Optional[int] = None
    create_session_if_missing: bool = False
    title: Optional[str] = None


class AgentResponse(BaseModel):
    reply: str
    session_id: Optional[int] = None
