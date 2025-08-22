from typing import Optional, List
from sqlalchemy import select, delete, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from datetime import datetime
import asyncio
import os

from app.models.eve import EveMessage, EveSession, EveRole
from app.models.journal import Journal
from app.models.user import User
from app.utilities.tts import TTSResult, GeminiTTSAdapter
from app.utilities.stt import SpeechToText
from app.services.llm.gemini import GeminiService
from app.config import settings
from app.routes.eve.schema.eve import (
    JournalEveResponse,
    VoiceSessionStartResponse,
    VoiceSessionTurnResponse,
    VoiceSessionEndResponse,
    JournalCreateRequest,
    JournalUpdateRequest,
    JournalResponse,
    EveMessageCreateRequest,
    EveMessageUpdateRequest,
    EveMessageResponse,
)

AUDIO_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../../audio")
)


class EveService:
    """Unified service for handling Eve interactions."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.llm = GeminiService(settings.gemini_api_key)
        self.tts = GeminiTTSAdapter(model=settings.tts_model)
        self.stt = SpeechToText()

    # ---------- Journal → Eve (one-shot voice reply) ----------
    async def journal_reply(
        self, journal_id: str, user: User
    ) -> Optional[JournalEveResponse]:
        """Generate Eve's supportive reply to a journal entry."""
        # Get journal with existing Eve messages
        stmt = (
            select(Journal)
            .options(selectinload(Journal.eve_messages))
            .where(Journal.id == journal_id, Journal.user_id == user.id)
        )
        result = await self.db.execute(stmt)
        journal = result.scalar_one_or_none()

        if not journal:
            return None

        # Build context from journal and previous Eve messages
        context = self._build_journal_context(journal)

        # Get supportive reply from Gemini
        reply_text = await asyncio.to_thread(self.llm.generate_reply, context)

        # Convert reply to speech
        tts_result: TTSResult = await self.tts.synthesize_to_local(
            reply_text, AUDIO_DIR
        )

        # Store Eve message
        eve_msg = EveMessage(
            user_id=user.id,
            journal_id=journal.id,
            role=EveRole.EVE,
            text=reply_text,
            audio_path=tts_result.tts_meta.get("local_path"),
        )
        self.db.add(eve_msg)
        await self.db.commit()
        await self.db.refresh(eve_msg)

        return JournalEveResponse(
            message_id=eve_msg.id,
            text=eve_msg.text,
            audio_path=eve_msg.audio_path,
            created_at=eve_msg.created_at,
        )

    def _build_journal_context(self, journal: Journal) -> str:
        """Build context for journal reply."""
        previous_messages = []
        for msg in sorted(journal.eve_messages, key=lambda x: x.created_at):
            role_name = "User" if msg.role == EveRole.USER else "Eve"
            previous_messages.append(f"{role_name}: {msg.text}")

        context_parts = [
            f"Journal Title: {journal.title}",
            f"Journal Content: {journal.content}",
        ]

        if previous_messages:
            context_parts.append("Previous conversation:")
            context_parts.extend(previous_messages)

        return "\n".join(context_parts)

    # ---------- Interactive voice session ----------
    async def start_voice_session(
        self, system_prompt: str, user: User
    ) -> VoiceSessionStartResponse:
        """Start a new voice session."""
        session = EveSession(
            user_id=user.id,
            system_prompt=system_prompt,
            is_active=True,
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)

        return VoiceSessionStartResponse(
            session_id=session.id,
            system_prompt=session.system_prompt,
            is_active=session.is_active,
            created_at=session.created_at,
        )

    async def voice_turn(
        self, session_id: str, audio_bytes: bytes, user: User
    ) -> Optional[VoiceSessionTurnResponse]:
        """Process a voice turn in an active session."""
        # Get active session
        stmt = (
            select(EveSession)
            .options(selectinload(EveSession.messages))
            .where(
                EveSession.id == session_id,
                EveSession.user_id == user.id,
                EveSession.is_active,
            )
        )
        result = await self.db.execute(stmt)
        session = result.scalar_one_or_none()

        if not session:
            return None

        # Convert speech to text
        user_text = await asyncio.to_thread(
            self.stt.transcribe_from_bytes, audio_bytes, "audio/wav"
        )

        # Get Eve's reply using session context
        eve_reply = await asyncio.to_thread(
            self.llm.chat_with_context, session, user_text
        )

        # Convert Eve's reply to speech
        tts_result: TTSResult = await self.tts.synthesize_to_gcs(eve_reply)

        # Store both user and eve messages
        user_msg = EveMessage(
            user_id=user.id,
            session_id=session.id,
            role=EveRole.USER,
            text=user_text,
        )
        eve_msg = EveMessage(
            user_id=user.id,
            session_id=session.id,
            role=EveRole.EVE,
            text=eve_reply,
            audio_path=tts_result.tts_meta.get("local_path"),
        )

        self.db.add_all([user_msg, eve_msg])
        await self.db.commit()
        await self.db.refresh(user_msg)
        await self.db.refresh(eve_msg)

        return VoiceSessionTurnResponse(
            user_message_id=user_msg.id,
            eve_message_id=eve_msg.id,
            user_text=user_msg.text,
            eve_text=eve_msg.text,
            audio_path=eve_msg.audio_path,
            created_at=eve_msg.created_at,
        )

    async def end_voice_session(
        self, session_id: str, user: User, save_summary: bool = False
    ) -> Optional[VoiceSessionEndResponse]:
        """End a voice session and optionally save summary."""
        stmt = (
            select(EveSession)
            .options(selectinload(EveSession.messages))
            .where(
                EveSession.id == session_id,
                EveSession.user_id == user.id,
                EveSession.is_active,
            )
        )
        result = await self.db.execute(stmt)
        session = result.scalar_one_or_none()

        if not session:
            return None

        summary = None
        if save_summary and session.messages:
            # Generate summary before deletion
            history = " ".join([m.text for m in session.messages])
            summary = await asyncio.to_thread(self.llm.summarize, history)

        # Mark session as ended and delete messages (as per requirements)
        session.is_active = False
        session.ended_at = datetime.utcnow()

        # Delete all messages associated with this session
        await self.db.execute(
            delete(EveMessage).where(EveMessage.session_id == session_id)
        )

        await self.db.commit()

        return VoiceSessionEndResponse(
            session_id=session.id,
            status="ended",
            summary=summary,
        )

    # ---------- Journal CRUD (simplified for Eve context) ----------
    async def list_journals(self, user: User) -> List[JournalResponse]:
        """List user's journals."""
        stmt = (
            select(Journal)
            .where(Journal.user_id == user.id)
            .order_by(desc(Journal.created_at))
        )
        result = await self.db.execute(stmt)
        journals = result.scalars().all()

        return [
            JournalResponse(
                id=j.id,
                user_id=j.user_id,
                title=j.title,
                content=j.content,
                created_at=j.created_at,
                updated_at=j.updated_at,
            )
            for j in journals
        ]

    async def get_journal(
        self, journal_id: str, user: User
    ) -> Optional[JournalResponse]:
        """Get a specific journal."""
        stmt = select(Journal).where(
            Journal.id == journal_id, Journal.user_id == user.id
        )
        result = await self.db.execute(stmt)
        journal = result.scalar_one_or_none()

        if not journal:
            return None

        return JournalResponse(
            id=journal.id,
            user_id=journal.user_id,
            title=journal.title,
            content=journal.content,
            created_at=journal.created_at,
            updated_at=journal.updated_at,
        )

    async def create_journal(
        self, payload: JournalCreateRequest, user: User
    ) -> JournalResponse:
        """Create a new journal."""
        journal = Journal(
            user_id=user.id,
            title=payload.title,
            content=payload.content,
        )
        self.db.add(journal)
        await self.db.commit()
        await self.db.refresh(journal)

        return JournalResponse(
            id=journal.id,
            user_id=journal.user_id,
            title=journal.title,
            content=journal.content,
            created_at=journal.created_at,
            updated_at=journal.updated_at,
        )

    async def update_journal(
        self, journal_id: str, payload: JournalUpdateRequest, user: User
    ) -> Optional[JournalResponse]:
        """Update a journal."""
        stmt = select(Journal).where(
            Journal.id == journal_id, Journal.user_id == user.id
        )
        result = await self.db.execute(stmt)
        journal = result.scalar_one_or_none()

        if not journal:
            return None

        if payload.title is not None:
            journal.title = payload.title
        if payload.content is not None:
            journal.content = payload.content

        await self.db.commit()
        await self.db.refresh(journal)

        return JournalResponse(
            id=journal.id,
            user_id=journal.user_id,
            title=journal.title,
            content=journal.content,
            created_at=journal.created_at,
            updated_at=journal.updated_at,
        )

    async def delete_journal(self, journal_id: str, user: User) -> bool:
        """Delete a journal."""
        stmt = select(Journal).where(
            Journal.id == journal_id, Journal.user_id == user.id
        )
        result = await self.db.execute(stmt)
        journal = result.scalar_one_or_none()

        if not journal:
            return False

        await self.db.delete(journal)
        await self.db.commit()
        return True

    # ---------- Eve Message CRUD ----------
    async def list_messages(
        self, journal_id: str, user: User
    ) -> List[EveMessageResponse]:
        """List messages for a journal."""
        stmt = (
            select(EveMessage)
            .where(EveMessage.journal_id == journal_id, EveMessage.user_id == user.id)
            .order_by(asc(EveMessage.created_at))
        )
        result = await self.db.execute(stmt)
        messages = result.scalars().all()

        return [
            EveMessageResponse(
                id=m.id,
                user_id=m.user_id,
                journal_id=m.journal_id,
                session_id=m.session_id,
                role=m.role,
                text=m.text,
                audio_path=m.audio_path,
                created_at=m.created_at,
            )
            for m in messages
        ]

    async def create_message(
        self, journal_id: str, payload: EveMessageCreateRequest, user: User
    ) -> EveMessageResponse:
        """Create a new message."""
        message = EveMessage(
            user_id=user.id,
            journal_id=journal_id,
            role=EveRole.EVE if payload.role == "eve" else EveRole.USER,
            text=payload.text,
        )
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)

        return EveMessageResponse(
            id=message.id,
            user_id=message.user_id,
            journal_id=message.journal_id,
            session_id=message.session_id,
            role=message.role,
            text=message.text,
            audio_path=message.audio_path,
            created_at=message.created_at,
        )

    async def update_message(
        self, message_id: str, payload: EveMessageUpdateRequest, user: User
    ) -> Optional[EveMessageResponse]:
        """Update a message."""
        stmt = select(EveMessage).where(
            EveMessage.id == message_id, EveMessage.user_id == user.id
        )
        result = await self.db.execute(stmt)
        message = result.scalar_one_or_none()

        if not message:
            return None

        if payload.text is not None:
            message.text = payload.text

        await self.db.commit()
        await self.db.refresh(message)

        return EveMessageResponse(
            id=message.id,
            user_id=message.user_id,
            journal_id=message.journal_id,
            session_id=message.session_id,
            role=message.role,
            text=message.text,
            audio_path=message.audio_path,
            created_at=message.created_at,
        )

    async def delete_message(self, message_id: str, user: User) -> bool:
        """Delete a message."""
        stmt = select(EveMessage).where(
            EveMessage.id == message_id, EveMessage.user_id == user.id
        )
        result = await self.db.execute(stmt)
        message = result.scalar_one_or_none()

        if not message:
            return False

        await self.db.delete(message)
        await self.db.commit()
        return True
