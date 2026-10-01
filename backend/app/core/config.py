from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LRM HRMS API"
    environment: str = "development"
    api_prefix: str = "/api"
    frontend_origin: str = "http://localhost:5173"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/hrms"
    jwt_secret: str = "change-this-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 720
    timezone: str = "Asia/Kolkata"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
