from pydantic import BaseModel, Field
from typing import Optional, List

class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    muscle_group: Optional[str] = None  # 'chest', 'back', 'legs', 'core', etc.
    secondary_muscles: Optional[List[str]] = None  # List of secondary muscle groups
    equipment_needed: Optional[str] = None  # 'bodyweight', 'dumbbell', 'barbell', etc.
    difficulty_level: Optional[str] = None  # 'beginner', 'intermediate', 'advanced'
    exercise_type: Optional[str] = None  # 'strength', 'cardio', 'flexibility', etc.
    is_compound: Optional[bool] = False  # True for compound exercises
    
    # Workout parameters
    default_sets: Optional[int] = Field(None, ge=1)
    default_reps_min: Optional[int] = Field(None, ge=1)
    default_reps_max: Optional[int] = Field(None, ge=1)
    default_rest_seconds: Optional[int] = Field(None, ge=0)
    
    # Media and instructions
    video_url: Optional[str] = None
    instructions: Optional[str] = None
    tags: Optional[List[str]] = None  # Additional tags
    
    # Legacy fields (for backward compatibility)
    equipment: Optional[str] = None  # Legacy field
    difficulty: Optional[str] = None  # Legacy field

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    muscle_group: Optional[str] = None
    secondary_muscles: Optional[List[str]] = None
    equipment_needed: Optional[str] = None
    difficulty_level: Optional[str] = None
    exercise_type: Optional[str] = None
    is_compound: Optional[bool] = None
    
    # Workout parameters
    default_sets: Optional[int] = Field(None, ge=1)
    default_reps_min: Optional[int] = Field(None, ge=1)
    default_reps_max: Optional[int] = Field(None, ge=1)
    default_rest_seconds: Optional[int] = Field(None, ge=0)
    
    # Media and instructions
    video_url: Optional[str] = None
    instructions: Optional[str] = None
    tags: Optional[List[str]] = None
    
    # Legacy fields
    equipment: Optional[str] = None
    difficulty: Optional[str] = None

class ExerciseResponse(ExerciseBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class ExerciseFilter(BaseModel):
    muscle_group: Optional[str] = None
    equipment_needed: Optional[str] = None
    difficulty_level: Optional[str] = None
    exercise_type: Optional[str] = None
    is_compound: Optional[bool] = None
    is_active: Optional[bool] = None
    
    # Legacy fields
    equipment: Optional[str] = None
    difficulty: Optional[str] = None 