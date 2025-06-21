from pydantic import BaseModel, Field
from typing import Optional

class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    muscle_group: Optional[str] = None  # 'chest', 'back', 'legs', 'core', etc.
    equipment: Optional[str] = None  # 'bodyweight', 'dumbbell', 'barbell', etc.
    difficulty: Optional[str] = None  # 'beginner', 'intermediate', 'advanced'
    video_url: Optional[str] = None

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    muscle_group: Optional[str] = None
    equipment: Optional[str] = None
    difficulty: Optional[str] = None
    video_url: Optional[str] = None

class ExerciseResponse(ExerciseBase):
    id: int

    class Config:
        orm_mode = True

class ExerciseFilter(BaseModel):
    muscle_group: Optional[str] = None
    equipment: Optional[str] = None
    difficulty: Optional[str] = None 