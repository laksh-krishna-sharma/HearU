from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from typing import Optional


class RegisterRequest(SQLModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    username: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None


class LoginRequest(SQLModel):
    email: EmailStr
    password: str


class UserOut(SQLModel):
    id: str
    name: Optional[str]
    email: EmailStr
    username: Optional[str]
    is_admin: bool
