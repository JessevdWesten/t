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
    
    # CORS - handle as string to avoid JSON parsing issues
    allowed_origins_str: str = os.getenv("ALLOWED_ORIGINS", "")
    
    class Config:
        env_file = ".env"
    
    @property
    def allowed_origins(self):
        """Convert allowed_origins_str to list, handling both single and comma-separated values"""
        origins = [
            "http://localhost:3000",  # Development
            "http://127.0.0.1:3000",  # Development alternative
        ]
        
        # Add production origins if provided
        if self.allowed_origins_str:
            # Handle both single URL and comma-separated URLs
            prod_origins = [url.strip() for url in self.allowed_origins_str.split(",")]
            origins.extend(prod_origins)
        
        # Filter out empty strings
        return [origin for origin in origins if origin]

settings = Settings() 