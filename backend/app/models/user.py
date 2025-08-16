import uuid
from datetime import datetime
from typing import Optional, Dict, Any

from sqlalchemy import Column, String, Integer, DateTime, Boolean, LargeBinary, func
from sqlalchemy.orm import relationship
from utilities.db import Base

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def gen_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: str = Column(String(36), primary_key=True, default=gen_uuid)

    name: Optional[str] = Column(String(255), nullable=True)
    age: Optional[int] = Column(Integer, nullable=True)
    photo: Optional[bytes] = Column(
        LargeBinary, nullable=True
    )
    gender: Optional[str] = Column(String(32), nullable=True)

    username: Optional[str] = Column(
        String(128), nullable=True, unique=True, index=True
    )
    email: str = Column(String(255), nullable=False, unique=True, index=True)

    hashed_password: str = Column(String(255), nullable=False)

    is_admin: bool = Column(Boolean, default=False, nullable=False)
    created_at: datetime = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    chat_sessions = relationship(
        "ChatSession",
        back_populates="user",
        cascade="all, delete-orphan"
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
