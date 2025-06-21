from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
import time
from sqlalchemy.exc import OperationalError

from config import settings
from routers import auth, users, exercises, recipes, plans
from database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Smart Fitness & Nutrition Coach API",
    description="API for personalized fitness and nutrition planning",
    version="1.0.0",
)

def create_tables_with_retry(max_retries=5, delay=5):
    """Create database tables with retry logic."""
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting to create database tables (attempt {attempt + 1}/{max_retries})")
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
            return True
        except OperationalError as e:
            logger.warning(f"Database connection failed on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                logger.error("Failed to connect to database after all attempts")
                raise
    return False

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    logger.info("Starting application...")
    create_tables_with_retry()
    logger.info("Application startup completed")

# Configure CORS with deployment-friendly settings
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:3000",  # Local development alternative
]

# Add production origins from environment
if settings.allowed_origins:
    allowed_origins.extend(settings.allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["Exercises"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["Recipes"])
app.include_router(plans.router, prefix="/api/plans", tags=["Plans"])

@app.get("/")
async def root():
    return {
        "message": "Smart Fitness & Nutrition Coach API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint that also tests database connectivity."""
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 