import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field
from sqlalchemy import (
    Column,
    Text,
    DateTime,
    func,
    ForeignKey,
)

if TYPE_CHECKING:
    pass


def gen_uuid() -> str:
    return str(uuid.uuid4())


class VoiceSessionResponseData(SQLModel, table=True):
    """
    Stores the response data from /api/eve/voice/end endpoint.
    This allows users to save and retrieve voice session end responses.
    """

    __tablename__ = "voice_session_responses"

    id: str = Field(default_factory=gen_uuid, primary_key=True, max_length=36)

    # FK with CASCADE (if user is deleted, remove responses)
    user_id: str = Field(
        sa_column=Column(
            ForeignKey("users.id", ondelete="CASCADE"),
            index=True,
            nullable=False,
        )
    )

    # Original session ID from the voice session
    session_id: str = Field(max_length=36, nullable=False, index=True)

    # Status from the voice session end response
    status: str = Field(max_length=50, nullable=False)

    # Optional summary content
    summary: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))

    # Optional notes journal ID
    notes_journal_id: Optional[str] = Field(default=None, max_length=36)

    # Optional notes content
    notes_content: Optional[str] = Field(
        default=None, sa_column=Column(Text, nullable=True)
    )

    # Metadata
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
    updated_at: Optional[datetime] = Field(default=None)

    # Relationships - we don't define back_populates since User model might not have this relationship
    # user: Optional["User"] = Relationship(back_populates="voice_session_responses")
