FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy requirements file
COPY requirements.txt .

# Use uv to install dependencies into a virtual environment
RUN uv venv
RUN . .venv/bin/activate && uv pip install -r requirements.txt

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Copy the installed packages from builder stage
COPY --from=builder /app/.venv /app/.venv

# Copy application files
COPY ./app ./app
COPY gunicorn_conf.py .

# Activate the virtual environment
ENV PATH="/app/.venv/bin:$PATH"
ENV PORT=8000

ENTRYPOINT ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]
