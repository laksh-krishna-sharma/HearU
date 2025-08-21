FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

ENV PORT=8000
EXPOSE ${PORT}

CMD ["sh", "-c", "gunicorn -k uvicorn.workers.UvicornWorker -c gunicorn_conf.py -b 0.0.0.0:${PORT} app.main:app"]