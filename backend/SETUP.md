# SETUP

### set virtual enviornment

```zsh
uv venv --python=3.13
source .venv/bin/activate
```
### install dependencies

```zsh
uv add fastapi 'uvicorn[standard]' passlib sqlalchemy pydantic_settings pydantic jwt asyncpg 'pydantic[email]' PyJWT google-genai httpx google-generativeai sqlmodel bcrypt
```

```zsh
uv add --group dev black mypy ruff
```