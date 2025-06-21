from pydantic import BaseModel, Field  
from typing import Optional, Dict, Any
from datetime import datetime, date

class PlanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    plan_type: PlanTypeEnum
    duration_weeks: int = Field(1, ge=1, le=52)

class PlanCreate(PlanBase):
    start_date: datetime
    plan_data: Dict[str, Any]

class PlanUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[PlanStatusEnum] = None
    end_date: Optional[datetime] = None
    plan_data: Optional[Dict[str, Any]] = None
    completion_percentage: Optional[float] = Field(None, ge=0, le=100)
    user_rating: Optional[int] = Field(None, ge=1, le=5)
    user_feedback: Optional[str] = None

class PlanResponse(PlanBase):
    id: int
    user_id: int
    status: PlanStatusEnum
    start_date: datetime
    end_date: Optional[datetime] = None
    plan_data: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime] = None
    completion_percentage: float
    user_rating: Optional[int] = None
    user_feedback: Optional[str] = None
    is_active: bool

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