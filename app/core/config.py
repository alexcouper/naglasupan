import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30
    environment: str = "development"
    
    class Config:
        env_file = ".env"


settings = Settings()