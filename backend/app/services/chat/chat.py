from __future__ import annotations

from typing import List, Optional, Protocol

import httpx
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from utilities.logger import logger
from utilities.db import async_session
from models.chat import ChatSession, Message, Role

from config import settings

log = logger(__name__)


class ChatMessage(BaseModel):
    role: Role
    content: str


class ChatProvider(Protocol):
    async def generate_response(self, prompt: str, history: List[ChatMessage]) -> str:
        ...


class GeminiProvider:
    def __init__(self, model: str = "gemini-2.0-flash"):
        self.api_key = settings.gemini_api_key
        self.model = model
        self._endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    async def generate_response(self, prompt: str, history: List[ChatMessage]) -> str:
        messages_text = "\n".join(f"{m.role.value}: {m.content}" for m in history if m.content)
        full_prompt = f"{messages_text}\nuser: {prompt}\nassistant:"
        payload = {
            "prompt": {"text": full_prompt},
            "temperature": 0.7,
            "maxOutputTokens": 512
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                self._endpoint,
                params={"key": self.api_key},
                json=payload
            )
            resp.raise_for_status()
            data = resp.json()

        if "candidates" in data and data["candidates"]:
            return data["candidates"][0].get("output", "") or data["candidates"][0].get("content", "")
        if "output" in data and isinstance(data["output"], dict):
            return data["output"].get("text", "")
        return str(data)


class ChatService:
    def __init__(self, provider: ChatProvider, db_session_factory=async_session):
        self.provider = provider
        self.db_session_factory = db_session_factory

    async def create_session(self, user_id: Optional[str] = None, title: Optional[str] = None) -> ChatSession:
        async with self.db_session_factory() as session:
            cs = ChatSession(user_id=user_id, title=title)
            session.add(cs)
            await session.commit()
            await session.refresh(cs)
            return cs

    async def get_session(self, session_id: int) -> Optional[ChatSession]:
        async with self.db_session_factory() as session:
            return await session.get(ChatSession, session_id)

    async def delete_session(self, session_id: int) -> None:
        async with self.db_session_factory() as session:
            obj = await session.get(ChatSession, session_id)
            if obj:
                await session.delete(obj)
                await session.commit()

    async def add_message(self, session_id: int, role: Role, content: str) -> Message:
        async with self.db_session_factory() as session:
            msg = Message(session_id=session_id, role=role, content=content)
            session.add(msg)
            await session.commit()
            await session.refresh(msg)
            return msg

    async def get_history(self, session_id: int, limit: Optional[int] = None) -> List[ChatMessage]:
        async with self.db_session_factory() as session:
            q = select(Message).where(Message.session_id == session_id).order_by(Message.created_at)
            if limit:
                q = q.limit(limit)
            result = await session.execute(q)
            msgs = result.scalars().all()
            return [ChatMessage(role=m.role, content=m.content) for m in msgs]

    async def send_user_message_and_get_reply(self, session_id: int, user_text: str) -> str:
        await self.add_message(session_id=session_id, role=Role.user, content=user_text)
        history = await self.get_history(session_id=session_id)
        response_text = await self.provider.generate_response(user_text, history)
        await self.add_message(session_id=session_id, role=Role.assistant, content=response_text)
        return response_text
