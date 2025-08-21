import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, DateTime, func, Text

if TYPE_CHECKING:
    from models.user import User
    from models.eve import EveMessage


def gen_uuid() -> str:
    return str(uuid.uuid4())


class Journal(SQLModel, table=True):
    __tablename__ = "journals"

    id: str = Field(default_factory=gen_uuid, primary_key=True, max_length=36)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)

    title: str = Field(max_length=255, nullable=False)
    content: str = Field(sa_column=Column("content", Text), default="")
    tags: Optional[str] = Field(default=None, max_length=1024)

    # User-provided date (e.g., 4 February 7:30 PM)
    entry_date: datetime = Field(
        sa_column=Column("entry_date", DateTime(timezone=True), nullable=False),
        default_factory=datetime.utcnow,
    )

    created_at: datetime = Field(
        sa_column=Column(
            "created_at",
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column("updated_at", DateTime(timezone=True), onupdate=func.now()),
        default=None,
    )

    eve_messages: List["EveMessage"] = Relationship(
        back_populates="journal", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


    # Relationship back to User
    user: Optional["User"] = Relationship(back_populates="journals")
