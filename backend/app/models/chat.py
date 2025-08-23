from datetime import datetime
from enum import Enum
from typing import Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime, Text

if TYPE_CHECKING:
    from app.models.user import User


class Role(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    user_id: str = Field(foreign_key="users.id", max_length=36, index=True)

    title: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(
            "created_at", DateTime(timezone=True), nullable=False, default=datetime.now
        ),
    )

    messages: list["Message"] = Relationship(
        back_populates="session", cascade_delete=True
    )

    user: "User" = Relationship(back_populates="chat_sessions")


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    session_id: int = Field(foreign_key="chat_sessions.id", index=True)

    role: Role = Field()
    content: str = Field(sa_column=Column(Text))
    created_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(
            "created_at", DateTime(timezone=True), nullable=False, default=datetime.now
        ),
    )

    session: ChatSession = Relationship(back_populates="messages")
