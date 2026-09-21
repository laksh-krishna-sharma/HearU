FROM python:3.13-slim AS builder

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy project metadata and lockfile
COPY pyproject.toml uv.lock ./

# Install production deps (uv sync creates .venv)
RUN uv sync --frozen --no-dev --no-install-project

# Final stage
FROM python:3.13-slim

WORKDIR /app
# Create directory for audio files
RUN mkdir -p /audio

# Copy the installed packages from builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy application files
COPY ./app ./app
COPY gunicorn_conf.py .

# Activate the virtual environment
ENV PATH="/app/.venv/bin:$PATH"
ENV PORT=8000

ENTRYPOINT ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]
