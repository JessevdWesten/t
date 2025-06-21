from pydantic import BaseModel, Field  
from typing import Optional, Dict, Any
from datetime import datetime, date

# Plan Schemas (for the new Plan model)
class PlanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    plan_type: str  # 'workout', 'meal'
    duration_weeks: Optional[int] = Field(None, ge=1, le=52)
    start_date: Optional[date] = None
    plan_data: Optional[Dict[str, Any]] = None

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    plan_type: Optional[str] = None
    status: Optional[str] = None
    duration_weeks: Optional[int] = Field(None, ge=1, le=52)
    start_date: Optional[date] = None
    plan_data: Optional[Dict[str, Any]] = None

class PlanResponse(PlanBase):
    id: int
    user_id: int
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True



class GeneratedPlanBase(BaseModel):
    plan_type: Optional[str] = None  # 'workout', 'meal'
    start_date: Optional[date] = None
    plan_data: Optional[Dict[str, Any]] = None  # {'monday': [...], 'tuesday': [...]}

class GeneratedPlanCreate(GeneratedPlanBase):
    user_id: Optional[int] = None

class GeneratedPlanUpdate(BaseModel):
    plan_type: Optional[str] = None
    start_date: Optional[date] = None
    plan_data: Optional[Dict[str, Any]] = None

class GeneratedPlanResponse(GeneratedPlanBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        orm_mode = True

class UserFeedbackLogBase(BaseModel):
    plan_id: Optional[int] = None
    item_id: Optional[int] = None  # exercise_id or recipe_id
    feedback_type: Optional[str] = None  # 'completed', 'skipped', 'too_hard', 'liked'
    feedback_value: Optional[int] = None  # 1 for positive, -1 for negative

class UserFeedbackLogCreate(UserFeedbackLogBase):
    user_id: Optional[int] = None

class UserFeedbackLogResponse(UserFeedbackLogBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        orm_mode = True

class PlanGenerationRequest(BaseModel):
    plan_type: str  # 'workout', 'meal'
    duration_weeks: int = Field(1, ge=1, le=52)
    start_date: Optional[date] = None
    preferences: Optional[Dict[str, Any]] = None 