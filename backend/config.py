from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database - Default to SQLite for easy setup
    database_url: str = "sqlite:///./fitnesstracker.db"
    
    # JWT
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # App
    app_name: str = "Smart Fitness & Nutrition Coach"
    debug: bool = True
    
    # CORS
    allowed_origins: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings() 