import time
from typing import Any, Callable, TypeVar, Dict, AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.utilities.logger import logger

from app.routes.auth.auth import router as auth_router
from app.routes.chat.chat import router as chat_router
from app.routes.blog.blog import router as blog_router
from app.routes.journal.journal import router as journal_router
from app.routes.eve.eve import router as eve_router
from app.routes.voice_session_response.voice_session_response import (
    router as voice_session_response_router,
)

from app.utilities.db import init_models, async_session
from app.services.auth.auth import create_default_admin_if_missing

description = """
HearU API's
"""

log = logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:

    log.info("Starting HearU API...")
    await init_models()
    async with async_session() as session:
        await create_default_admin_if_missing(session)
    log.info("Startup complete.")

    yield

    log.info("Shutting down HearU API...")
    await async_session().close_all()
    log.info("Shutdown complete.")


app = FastAPI(
    title="HearU",
    description=description,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    root_path=settings.root_path,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://hearu-e8zutv880-lakshs-projects-e8fa6099.vercel.app",
        "https://hearu-proto.vercel.app",
    ],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(blog_router)
app.include_router(journal_router)
app.include_router(eve_router)
app.include_router(voice_session_response_router)


@app.get("/", tags=["Health"])
async def health_check() -> Dict[str, str]:
    return {"status": "ok", "message": "HearU API is running"}


F = TypeVar("F", bound=Callable[..., Any])


@app.middleware("http")
async def process_time_log_middleware(
    request: Request, call_next: Callable[[Request], Any]
) -> Response:
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = str(round(time.time() - start_time, 3))
    response.headers["X-Process-Time"] = process_time
    log.info(
        "Method=%s Path=%s StatusCode=%s ProcessTime=%s",
        request.method,
        request.url.path,
        response.status_code,
        process_time,
    )
    return response


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=True,
    )
