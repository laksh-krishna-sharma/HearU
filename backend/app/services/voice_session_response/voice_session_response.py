from typing import Optional, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.models.voice_session_response import VoiceSessionResponseData
from app.models.user import User
from app.routes.voice_session_response.schema.voice_session_response import (
    VoiceSessionResponseCreateRequest,
    VoiceSessionResponseUpdateRequest,
    VoiceSessionResponseResponse,
)


class VoiceSessionResponseService:
    """Service for handling voice session response data operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_response(
        self, payload: VoiceSessionResponseCreateRequest, user: User
    ) -> VoiceSessionResponseResponse:
        """Create a new voice session response record."""
        response_data = VoiceSessionResponseData(
            user_id=user.id,
            session_id=payload.session_id,
            status=payload.status,
            summary=payload.summary,
            notes_journal_id=payload.notes_journal_id,
            notes_content=payload.notes_content,
        )

        self.db.add(response_data)
        await self.db.commit()
        await self.db.refresh(response_data)

        return VoiceSessionResponseResponse(
            id=response_data.id,
            user_id=response_data.user_id,
            session_id=response_data.session_id,
            status=response_data.status,
            summary=response_data.summary,
            notes_journal_id=response_data.notes_journal_id,
            notes_content=response_data.notes_content,
            created_at=response_data.created_at,
            updated_at=response_data.updated_at,
        )

    async def get_response(
        self, response_id: str, user: User
    ) -> Optional[VoiceSessionResponseResponse]:
        """Get a specific voice session response by ID."""
        stmt = select(VoiceSessionResponseData).where(
            VoiceSessionResponseData.id == response_id,
            VoiceSessionResponseData.user_id == user.id,
        )
        result = await self.db.execute(stmt)
        response_data = result.scalar_one_or_none()

        if not response_data:
            return None

        return VoiceSessionResponseResponse(
            id=response_data.id,
            user_id=response_data.user_id,
            session_id=response_data.session_id,
            status=response_data.status,
            summary=response_data.summary,
            notes_journal_id=response_data.notes_journal_id,
            notes_content=response_data.notes_content,
            created_at=response_data.created_at,
            updated_at=response_data.updated_at,
        )

    async def list_responses(self, user: User) -> List[VoiceSessionResponseResponse]:
        """List all voice session responses for a user."""
        stmt = (
            select(VoiceSessionResponseData)
            .where(VoiceSessionResponseData.user_id == user.id)
            .order_by(desc(VoiceSessionResponseData.created_at))
        )
        result = await self.db.execute(stmt)
        responses = result.scalars().all()

        return [
            VoiceSessionResponseResponse(
                id=r.id,
                user_id=r.user_id,
                session_id=r.session_id,
                status=r.status,
                summary=r.summary,
                notes_journal_id=r.notes_journal_id,
                notes_content=r.notes_content,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in responses
        ]

    async def get_responses_by_session(
        self, session_id: str, user: User
    ) -> List[VoiceSessionResponseResponse]:
        """Get all voice session responses for a specific session."""
        stmt = (
            select(VoiceSessionResponseData)
            .where(
                VoiceSessionResponseData.session_id == session_id,
                VoiceSessionResponseData.user_id == user.id,
            )
            .order_by(desc(VoiceSessionResponseData.created_at))
        )
        result = await self.db.execute(stmt)
        responses = result.scalars().all()

        return [
            VoiceSessionResponseResponse(
                id=r.id,
                user_id=r.user_id,
                session_id=r.session_id,
                status=r.status,
                summary=r.summary,
                notes_journal_id=r.notes_journal_id,
                notes_content=r.notes_content,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in responses
        ]

    async def update_response(
        self, response_id: str, payload: VoiceSessionResponseUpdateRequest, user: User
    ) -> Optional[VoiceSessionResponseResponse]:
        """Update a voice session response."""
        stmt = select(VoiceSessionResponseData).where(
            VoiceSessionResponseData.id == response_id,
            VoiceSessionResponseData.user_id == user.id,
        )
        result = await self.db.execute(stmt)
        response_data = result.scalar_one_or_none()

        if not response_data:
            return None

        # Update fields if provided
        if payload.status is not None:
            response_data.status = payload.status
        if payload.summary is not None:
            response_data.summary = payload.summary
        if payload.notes_journal_id is not None:
            response_data.notes_journal_id = payload.notes_journal_id
        if payload.notes_content is not None:
            response_data.notes_content = payload.notes_content

        response_data.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(response_data)

        return VoiceSessionResponseResponse(
            id=response_data.id,
            user_id=response_data.user_id,
            session_id=response_data.session_id,
            status=response_data.status,
            summary=response_data.summary,
            notes_journal_id=response_data.notes_journal_id,
            notes_content=response_data.notes_content,
            created_at=response_data.created_at,
            updated_at=response_data.updated_at,
        )

    async def delete_response(self, response_id: str, user: User) -> bool:
        """Delete a voice session response."""
        stmt = select(VoiceSessionResponseData).where(
            VoiceSessionResponseData.id == response_id,
            VoiceSessionResponseData.user_id == user.id,
        )
        result = await self.db.execute(stmt)
        response_data = result.scalar_one_or_none()

        if not response_data:
            return False

        await self.db.delete(response_data)
        await self.db.commit()
        return True
