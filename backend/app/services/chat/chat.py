from __future__ import annotations

from typing import List, Optional, Protocol, Any, Callable

from pydantic import BaseModel

import google.generativeai as genai
from sqlalchemy import select
from dotenv import load_dotenv
import os
import sys
from utilities.logger import logger
from utilities.db import async_session
from models.chat import ChatSession, Message, Role
from static_values import SYSTEM_PROMPT

from config import settings

load_dotenv()

os.environ["GEMINI_API_KEY"] = settings.gemini_api_key

log = logger(__name__)

# Correct way to configure the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class ChatMessage(BaseModel):
    role: Role
    content: str


class ChatProvider(Protocol):
    async def generate_response(
        self, prompt: str, history: List[ChatMessage]
    ) -> str: ...


class GeminiProvider:
    def __init__(self, model: str = "gemini-2.0-flash"):
        self.model = model

    async def generate_response(self, prompt: str, history: List[ChatMessage]) -> str:
        try:
            # Correctly convert history to the format Gemini expects
            chat_history = []
            for msg in history:
                chat_history.append(
                    {"role": msg.role.value, "parts": [{"text": msg.content}]}
                )

            # Create model instance
            model = genai.GenerativeModel(self.model)

            # Start chat with the correctly formatted history
            chat = model.start_chat(history=chat_history)

            # The prompt is part of the first message, not sent separately
            # It should be added to the history before starting the chat
            # Let's send the prompt directly as the first message instead
            response = chat.send_message(
                f"{SYSTEM_PROMPT}\n\nUser: {prompt}",
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 1024,
                },
            )

            if response.text:
                return response.text
            else:
                return "I apologize, I was unable to generate a response."

        except Exception as e:
            log.error(f"Error generating response: {str(e)}")
            print(f"Error generating response: {str(e)}", file=sys.stderr)
            return "Sorry, there was an error generating the response."


class ChatService:
    def __init__(
        self,
        provider: ChatProvider,
        db_session_factory: Callable[[], Any] = async_session,
    ) -> None:
        self.provider = provider
        self.db_session_factory = db_session_factory

    async def create_session(
        self, user_id: Optional[str] = None, title: Optional[str] = None
    ) -> ChatSession:
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

    async def get_history(
        self, session_id: int, limit: Optional[int] = None
    ) -> List[ChatMessage]:
        async with self.db_session_factory() as session:
            q = (
                select(Message)
                .where(Message.session_id == session_id)
                .order_by(Message.created_at)
            )
            if limit:
                q = q.limit(limit)
            result = await session.execute(q)
            msgs = result.scalars().all()
            return [ChatMessage(role=m.role, content=m.content) for m in msgs]

    async def send_user_message_and_get_reply(
        self, session_id: int, user_text: str
    ) -> str:
        await self.add_message(session_id=session_id, role=Role.user, content=user_text)
        history = await self.get_history(session_id=session_id)
        response_text = await self.provider.generate_response(user_text, history)
        await self.add_message(
            session_id=session_id, role=Role.assistant, content=response_text
        )
        return response_text
