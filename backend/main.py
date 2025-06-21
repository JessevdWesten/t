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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
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
    return {"message": "Smart Fitness & Nutrition Coach API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 