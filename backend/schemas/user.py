from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from ..models.user import GenderEnum, ActivityLevelEnum, GoalEnum, WorkoutTypeEnum

# Base User Schema
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

# User Creation Schema
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

# User Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User Profile Update Schema
class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=13, le=120)
    gender: Optional[GenderEnum] = None
    height_cm: Optional[float] = Field(None, gt=0, le=300)
    weight_kg: Optional[float] = Field(None, gt=0, le=1000)
    activity_level: Optional[ActivityLevelEnum] = None
    goal: Optional[GoalEnum] = None
    target_weight_kg: Optional[float] = Field(None, gt=0, le=1000)
    
    # Dietary Preferences
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_paleo: Optional[bool] = None
    is_keto: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    allergies: Optional[str] = None
    
    # Fitness Preferences
    preferred_workout_types: Optional[List[WorkoutTypeEnum]] = None
    available_equipment: Optional[List[str]] = None
    workout_days_per_week: Optional[int] = Field(None, ge=1, le=7)
    workout_duration_minutes: Optional[int] = Field(None, ge=10, le=300)

# User Response Schema
class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    
    # Profile Information
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    
    # Lifestyle & Goals
    activity_level: Optional[ActivityLevelEnum] = None
    goal: Optional[GoalEnum] = None
    target_weight_kg: Optional[float] = None
    
    # Calculated Values
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    target_calories: Optional[float] = None
    
    class Config:
        orm_mode = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 