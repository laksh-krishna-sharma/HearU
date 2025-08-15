from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    db_uri: str = Field(..., env="DB_URI")
    root_path: str = Field("", env="ROOT_PATH")
    logging_level: str = Field("INFO", env="LOGGING_LEVEL")

settings = Settings()
