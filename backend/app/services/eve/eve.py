from typing import Optional
from sqlalchemy.orm import Session
import asyncio

from models.eve import EveMessage, EveSession, Journal
from utilities.tts import ITTSAdapter, TTSResult
from utilities.stt import SpeechToText
from llm.gemini import GeminiService


class JournalEveResponder:
    """Handles one-shot Eve replies for Journals."""

    def __init__(self, llm: GeminiService, tts: ITTSAdapter):
        self.llm = llm
        self.tts = tts

    async def reply_to_journal(self, db: Session, journal: Journal) -> EveMessage:
        # Build LLM context
        context = self._build_context(journal)

        # Get supportive reply from Gemini
        reply_text = await asyncio.to_thread(self.llm.generate_reply, context)

        # Convert reply to speech
        tts_result: TTSResult = await self.tts.synthesize_to_gcs(reply_text)

        # Persist EveMessage
        eve_msg = EveMessage(
            journal=journal,
            role="eve",
            text=reply_text,
            audio_url=tts_result.signed_url or tts_result.gcs_path,
            audio_duration=tts_result.duration_seconds,
            meta=tts_result.tts_meta,
        )
        db.add(eve_msg)
        db.commit()
        db.refresh(eve_msg)
        return eve_msg

    def _build_context(self, journal: Journal) -> str:
        msgs = [m.text for m in journal.eve_messages]
        return f"Journal: {journal.text}\nPrevious Eve replies:\n" + "\n".join(msgs)


class VoiceSessionManager:
    """Handles interactive Eve voice sessions."""

    def __init__(self, llm: GeminiService, tts: ITTSAdapter, stt: SpeechToText):
        self.llm = llm
        self.tts = tts
        self.stt = stt

    def start_session(self, db: Session, system_prompt: str) -> EveSession:
        session = EveSession(system_prompt=system_prompt)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    async def process_user_turn(self, db: Session, session: EveSession, audio_bytes: bytes) -> EveMessage:
        # Convert speech to text (STT runs sync → move to thread)
        user_text = await asyncio.to_thread(self.stt.transcribe_from_bytes, audio_bytes, "audio/wav")

        # Call Gemini with rolling context
        eve_reply = await asyncio.to_thread(self.llm.chat_with_context, session, user_text)

        # Convert reply text to speech
        tts_result: TTSResult = await self.tts.synthesize_to_gcs(eve_reply)

        # Store user + eve messages
        msg_user = EveMessage(session=session, role="user", text=user_text)
        msg_eve = EveMessage(
            session=session,
            role="eve",
            text=eve_reply,
            audio_url=tts_result.signed_url or tts_result.gcs_path,
            audio_duration=tts_result.duration_seconds,
            meta=tts_result.tts_meta,
        )

        db.add_all([msg_user, msg_eve])
        db.commit()
        db.refresh(msg_eve)
        return msg_eve

    async def summarize_session(self, session: EveSession) -> str:
        history = " ".join([m.text for m in session.messages])
        return await asyncio.to_thread(self.llm.summarize, history)

    def end_session(self, db: Session, session: EveSession):
        db.delete(session)
        db.commit()


class EveServiceFactory:
    """Factory to build different Eve services (Journal vs Voice)."""

    def __init__(self, llm: GeminiService, tts: ITTSAdapter, stt: SpeechToText):
        self.llm = llm
        self.tts = tts
        self.stt = stt

    def journal_responder(self) -> JournalEveResponder:
        return JournalEveResponder(self.llm, self.tts)

    def voice_session(self) -> VoiceSessionManager:
        return VoiceSessionManager(self.llm, self.tts, self.stt)
