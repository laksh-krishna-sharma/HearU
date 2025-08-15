import time
from typing import Any, Callable, TypeVar

import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from utilities.logger import logger
from routes.auth.auth import router as auth_router
from utilities.db import init_models, async_session
from services.auth.auth import create_default_admin_if_missing

description = """
HearU API's
"""

# Create logger instance
log = logger()

app = FastAPI(
    title="HearU",
    description=description,
    version="1.0.0",
    docs_url="/docs",   # Swagger at /docs
    redoc_url="/redoc", # Redoc at /redoc
    root_path=settings.root_path,
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=[
        "http://localhost:3000",
    ],
)

# Routers
app.include_router(auth_router)

# Health check
@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "HearU API is running"}


F = TypeVar("F", bound=Callable[..., Any])

@app.middleware("http")
async def process_time_log_middleware(request: Request, call_next: F) -> Response:
    """
    Add API process time in response headers and log calls
    """
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


@app.on_event("startup")
async def on_startup():
    """
    Create DB tables (if not present) and ensure default admin exists.
    """
    await init_models()
    async with async_session() as session:
        await create_default_admin_if_missing(session)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=True,
    )
