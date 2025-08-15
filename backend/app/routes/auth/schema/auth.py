from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    username: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: Optional[str]
    email: EmailStr
    username: Optional[str]
    is_admin: bool
