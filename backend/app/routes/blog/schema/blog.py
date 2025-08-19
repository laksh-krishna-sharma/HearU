from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class BlogCreate(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = []


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None


class BlogOut(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    tags: Optional[List[str]] = []
    created_at: datetime
    updated_at: Optional[datetime] = None
    author_name: Optional[str] = None

    class Config:
        from_attributes = True
