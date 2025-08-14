# SETUP

### set virtual enviornment

```zsh
uv venv --python=3.13
source .venv/bin/activate
```
### install dependencies

```zsh
uv add fastapi 'uvicorn[standard]'
```

```zsh
uv add --group dev black mypy ruff
```