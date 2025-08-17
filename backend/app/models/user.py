import uuid
from datetime import datetime
from typing import Optional, Dict, Any, TYPE_CHECKING, List

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, LargeBinary, DateTime, func
from passlib.context import CryptContext

if TYPE_CHECKING:
    from models.chat import ChatSession
    from models.blog import Blog

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def gen_uuid() -> str:
    return str(uuid.uuid4())


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(default_factory=gen_uuid, primary_key=True, max_length=36)

    name: Optional[str] = Field(default=None, max_length=255)
    age: Optional[int] = Field(default=None)
    photo: Optional[bytes] = Field(default=None, sa_column=Column(LargeBinary))
    gender: Optional[str] = Field(default=None, max_length=32)

    username: Optional[str] = Field(
        default=None, max_length=128, unique=True, index=True
    )
    email: str = Field(max_length=255, unique=True, index=True)

    hashed_password: str = Field(max_length=255)

    is_admin: bool = Field(default=False)
    created_at: datetime = Field(
        sa_column=Column(
            "created_at",
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )

    chat_sessions: List["ChatSession"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    blogs: List["Blog"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    def set_password(self, raw_password: str) -> None:
        """Hash and store password."""
        self.hashed_password = pwd_context.hash(raw_password)

    def verify_password(self, raw_password: str) -> bool:
        """Verify provided password against stored hash."""
        if not self.hashed_password:
            return False
        return pwd_context.verify(raw_password, self.hashed_password)

    def to_dict(self) -> Dict[str, Any]:
        """Minimal public representation (no hashed password)."""
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "username": self.username,
            "email": self.email,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} admin={self.is_admin}>"
