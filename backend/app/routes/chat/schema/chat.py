from typing import List, Optional
from sqlmodel import SQLModel


class CreateSessionRequest(SQLModel):
    title: Optional[str] = None


class SessionOut(SQLModel):
    session_id: int
    user_id: Optional[str] = None
    title: Optional[str] = None


class SendMessageRequest(SQLModel):
    text: str


class MessageOut(SQLModel):
    id: int
    role: str
    content: str
    created_at: str


class ChatHistoryResponse(SQLModel):
    session_id: int
    messages: List[MessageOut]


class AgentRequest(SQLModel):
    text: str
    session_id: Optional[int] = None
    create_session_if_missing: bool = False
    title: Optional[str] = None


class AgentResponse(SQLModel):
    reply: str
    session_id: Optional[int] = None
