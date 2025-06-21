from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from models.plan import PlanTypeEnum, PlanStatusEnum

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

class PlanGenerationRequest(BaseModel):
    plan_type: PlanTypeEnum
    duration_weeks: int = Field(1, ge=1, le=52)
    start_date: Optional[datetime] = None
    preferences: Optional[Dict[str, Any]] = None 