# SETUP

### set virtual enviornment

```zsh
uv venv --python=3.13
source .venv/bin/activate
```
### install dependencies

```zsh
uv pip install --upgrade pip
uv pip install -r requirements.txt
```

### install system dependency

`ffmpeg` is required for voice uploads (`webm`/`wav`) to be converted into PCM for Gemini Live.

```zsh
uv add --group dev black mypy ruff
```