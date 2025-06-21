from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.exercise import Exercise
from schemas.exercise import ExerciseCreate, ExerciseUpdate, ExerciseResponse, ExerciseFilter
from auth import get_current_active_user
from services.exercise_service import ExerciseService

router = APIRouter()

@router.get("/", response_model=List[ExerciseResponse])
async def get_exercises(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    filters: ExerciseFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get list of exercises with optional filtering."""
    exercise_service = ExerciseService(db)
    exercises = exercise_service.get_exercises(skip=skip, limit=limit, filters=filters)
    return exercises

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    """Get a specific exercise by ID."""
    exercise_service = ExerciseService(db)
    exercise = exercise_service.get_exercise(exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    return exercise

@router.post("/", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise_data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)  # Admin only in production
):
    """Create a new exercise."""
    exercise_service = ExerciseService(db)
    exercise = exercise_service.create_exercise(exercise_data)
    return exercise

@router.put("/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise(
    exercise_id: int,
    exercise_data: ExerciseUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)  # Admin only in production
):
    """Update an existing exercise."""
    exercise_service = ExerciseService(db)
    exercise = exercise_service.update_exercise(exercise_id, exercise_data)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    return exercise

@router.delete("/{exercise_id}")
async def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)  # Admin only in production
):
    """Delete an exercise (soft delete)."""
    exercise_service = ExerciseService(db)
    success = exercise_service.delete_exercise(exercise_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    return {"message": "Exercise deleted successfully"}

@router.get("/search/{query}", response_model=List[ExerciseResponse])
async def search_exercises(
    query: str,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search exercises by name or description."""
    exercise_service = ExerciseService(db)
    exercises = exercise_service.search_exercises(query, limit)
    return exercises 