from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Create engine with connection parameters to handle network issues
connect_args = {}
if settings.database_url.startswith("postgresql"):
    # Add PostgreSQL-specific connection parameters
    connect_args = {
        "connect_timeout": 30,
        "application_name": "fitnesstracker-api"
    }

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_timeout=30,
    pool_recycle=3600,  # Recycle connections every hour
    pool_pre_ping=True,  # Validate connections before use
    echo=settings.debug  # Log SQL queries in debug mode
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 