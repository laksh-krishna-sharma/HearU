from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.utilities.db import get_db, async_session
from app.routes.auth.auth import get_current_user
from app.models.user import User
from app.models.chat import Message
from app.services.chat.chat import ChatService, GeminiProvider

from app.routes.chat.schema.chat import (
    CreateSessionRequest,
    SessionOut,
    SendMessageRequest,
    ChatHistoryResponse,
    MessageOut,
    AgentRequest,
    AgentResponse,
)

router = APIRouter(prefix="/api/chat", tags=["chat"])

_provider = GeminiProvider(model="gemini-2.0-flash")
_chat_service = ChatService(provider=_provider, db_session_factory=async_session)


@router.post("/session", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def create_session(
    payload: CreateSessionRequest, current_user: User = Depends(get_current_user)
) -> SessionOut:
    cs = await _chat_service.create_session(
        user_id=current_user.id, title=payload.title
    )
    return SessionOut(session_id=cs.id, user_id=cs.user_id, title=cs.title)


@router.get("/{session_id}", response_model=ChatHistoryResponse)
async def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ChatHistoryResponse:
    cs = await _chat_service.get_session(session_id)
    if not cs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="session not found"
        )
    if cs.user_id and cs.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="access denied"
        )
    q = (
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at)
    )
    res = await db.execute(q)
    msgs: List[Message] = res.scalars().all()
    items = [
        MessageOut(
            id=m.id,
            role=m.role.value if hasattr(m.role, "value") else str(m.role),
            content=m.content,
            created_at=m.created_at.isoformat(),
        )
        for m in msgs
    ]
    return ChatHistoryResponse(session_id=session_id, messages=items)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: int, current_user: User = Depends(get_current_user)
) -> None:
    cs = await _chat_service.get_session(session_id)
    if not cs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="session not found"
        )
    if cs.user_id and cs.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="access denied"
        )
    await _chat_service.delete_session(session_id)
    return None


@router.post("/{session_id}/message")
async def send_message(
    session_id: int,
    payload: SendMessageRequest,
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    cs = await _chat_service.get_session(session_id)
    if not cs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="session not found"
        )
    if cs.user_id and cs.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="access denied"
        )
    reply = await _chat_service.send_user_message_and_get_reply(
        session_id=session_id, user_text=payload.text
    )
    return {"reply": reply}


@router.post("/agent", response_model=AgentResponse)
async def agent_endpoint(
    payload: AgentRequest, current_user: User = Depends(get_current_user)
) -> AgentResponse:
    session_id = payload.session_id
    if session_id:
        cs = await _chat_service.get_session(session_id)
        if not cs:
            if payload.create_session_if_missing:
                cs = await _chat_service.create_session(
                    user_id=current_user.id, title=payload.title
                )
                session_id = cs.id
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="session not found"
                )
        else:
            if (
                cs.user_id
                and cs.user_id != current_user.id
                and not current_user.is_admin
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="access denied"
                )
    else:
        cs = await _chat_service.create_session(
            user_id=current_user.id, title=payload.title
        )
        session_id = cs.id

    assert session_id is not None
    reply = await _chat_service.send_user_message_and_get_reply(
        session_id=session_id, user_text=payload.text
    )
    return AgentResponse(reply=reply, session_id=session_id)
