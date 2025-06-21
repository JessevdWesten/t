from pydantic import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database - SQLite for development, PostgreSQL for production
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./fitnesstracker.db")
    
    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # App
    app_name: str = "Smart Fitness & Nutrition Coach"
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS
    allowed_origins: list = [
        "http://localhost:3000",  # Development
        os.getenv("ALLOWED_ORIGINS", "")  # Production
    ]
    
    class Config:
        env_file = ".env"

# Filter out empty strings from allowed_origins
settings = Settings()
settings.allowed_origins = [origin for origin in settings.allowed_origins if origin] 