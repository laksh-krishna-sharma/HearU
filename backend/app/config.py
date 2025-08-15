from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR.parent.parent / ".env"  

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    db_uri: str = Field(..., env="DB_URI")
    root_path: str = Field("", env="ROOT_PATH")
    logging_level: str = Field("INFO", env="LOGGING_LEVEL")

settings = Settings()
