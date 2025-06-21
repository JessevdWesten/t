from pydantic import BaseModel, Field
from typing import Optional, List
from ..models.exercise import MuscleGroupEnum, EquipmentEnum, DifficultyEnum, ExerciseTypeEnum

class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = None
    muscle_group: MuscleGroupEnum
    exercise_type: ExerciseTypeEnum
    equipment_needed: EquipmentEnum
    difficulty_level: DifficultyEnum

class ExerciseCreate(ExerciseBase):
    secondary_muscles: Optional[List[MuscleGroupEnum]] = None
    calories_per_minute: Optional[float] = Field(None, ge=0)
    is_compound: Optional[bool] = False
    video_url: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    default_sets: Optional[int] = Field(3, ge=1, le=10)
    default_reps_min: Optional[int] = Field(None, ge=1)
    default_reps_max: Optional[int] = Field(None, ge=1)
    default_duration_seconds: Optional[int] = Field(None, ge=1)
    default_rest_seconds: Optional[int] = Field(60, ge=0)

class ExerciseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = None
    muscle_group: Optional[MuscleGroupEnum] = None
    exercise_type: Optional[ExerciseTypeEnum] = None
    equipment_needed: Optional[EquipmentEnum] = None
    difficulty_level: Optional[DifficultyEnum] = None
    secondary_muscles: Optional[List[MuscleGroupEnum]] = None
    calories_per_minute: Optional[float] = Field(None, ge=0)
    is_compound: Optional[bool] = None
    video_url: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    default_sets: Optional[int] = Field(None, ge=1, le=10)
    default_reps_min: Optional[int] = Field(None, ge=1)
    default_reps_max: Optional[int] = Field(None, ge=1)
    default_duration_seconds: Optional[int] = Field(None, ge=1)
    default_rest_seconds: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class ExerciseResponse(ExerciseBase):
    id: int
    secondary_muscles: Optional[List[str]] = None
    calories_per_minute: Optional[float] = None
    is_compound: bool
    video_url: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    default_sets: int
    default_reps_min: Optional[int] = None
    default_reps_max: Optional[int] = None
    default_duration_seconds: Optional[int] = None
    default_rest_seconds: int
    is_active: bool

    class Config:
        orm_mode = True

class ExerciseFilter(BaseModel):
    muscle_group: Optional[MuscleGroupEnum] = None
    equipment_needed: Optional[EquipmentEnum] = None
    difficulty_level: Optional[DifficultyEnum] = None
    exercise_type: Optional[ExerciseTypeEnum] = None
    is_compound: Optional[bool] = None
    is_active: Optional[bool] = True 