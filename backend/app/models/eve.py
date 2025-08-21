import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import (
    Column,
    Text,
    String,
    DateTime,
    func,
    Index,
    ForeignKey,
)

if TYPE_CHECKING:
    from models.user import User
    from models.journal import Journal


def gen_uuid() -> str:
    return str(uuid.uuid4())


class EveRole(str, Enum):
    USER = "user"
    EVE = "eve"


class EveSession(SQLModel, table=True):
    """
    Represents an interactive voice session with Eve.
    Stores a system prompt and linked message history.
    """

    __tablename__ = "eve_sessions"

    id: str = Field(default_factory=gen_uuid, primary_key=True, max_length=36)

    # FK with CASCADE (if user is deleted, remove sessions)
    user_id: str = Field(
        sa_column=Column(
            ForeignKey("users.id", ondelete="CASCADE"),
            index=True,
            nullable=False,
        )
    )

    # Keep prompt required (nullable handled at Column)
    system_prompt: str = Field(sa_column=Column(Text, nullable=False))
    is_active: bool = Field(default=True)

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
    ended_at: Optional[datetime] = Field(default=None)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="eve_sessions")
    messages: List["EveMessage"] = Relationship(
        back_populates="session",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            # "lazy": "selectin",  # enable if you prefer prefetching
        },
    )


class EveMessage(SQLModel, table=True):
    """
    Stores either a user utterance or Eve's reply (text + optional audio path).
    A message can belong to:
      - a Journal (one-shot reply context), or
      - an EveSession (interactive voice chat).
    """

    __tablename__ = "eve_messages"

    id: str = Field(default_factory=gen_uuid, primary_key=True, max_length=36)

    # FK with CASCADE (if user is deleted, remove messages)
    user_id: str = Field(
        sa_column=Column(
            ForeignKey("users.id", ondelete="CASCADE"),
            index=True,
            nullable=False,
        )
    )

    # Journal link is optional; if journal is deleted, set NULL to keep message record integrity
    journal_id: Optional[str] = Field(
        default=None,
        sa_column=Column(
            ForeignKey("journals.id", ondelete="SET NULL"),
            index=True,
            nullable=True,
        ),
    )

    # Session link is optional; if session is deleted, cascade delete messages at relationship level
    # (DB-level ondelete CASCADE isn’t strictly required because of relationship cascade,
    #  but we keep SET NULL for safety if you delete via raw SQL).
    session_id: Optional[str] = Field(
        default=None,
        sa_column=Column(
            ForeignKey("eve_sessions.id", ondelete="SET NULL"),
            index=True,
            nullable=True,
        ),
    )

    # Role constrained at app level via Enum; stored as short string
    role: EveRole = Field(
        default=EveRole.EVE,
        sa_column=Column(String(20), nullable=False),
    )

    # Required text body
    text: str = Field(sa_column=Column(Text, nullable=False))

    # Optional pointer to audio asset (GCS signed URL, gs:// path, or local path)
    audio_path: Optional[str] = Field(default=None, max_length=512)

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )

    # Relationships
    user: Optional["User"] = Relationship(back_populates="eve_messages")
    journal: Optional["Journal"] = Relationship(back_populates="eve_messages")
    session: Optional["EveSession"] = Relationship(back_populates="messages")


# Helpful indexes for common access patterns
Index("ix_eve_messages_session_ordered", EveMessage.session_id, EveMessage.created_at)
Index("ix_eve_messages_journal_ordered", EveMessage.journal_id, EveMessage.created_at)
Index("ix_eve_messages_user_ordered", EveMessage.user_id, EveMessage.created_at)
