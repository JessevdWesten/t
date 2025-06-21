from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .routers import auth, users, exercises, recipes, plans
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Fitness & Nutrition Coach API",
    description="API for personalized fitness and nutrition planning",
    version="1.0.0",
)

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
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 