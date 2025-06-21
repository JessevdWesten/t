from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.plan import Plan
from models.user import User
from schemas.plan import PlanCreate, PlanUpdate, PlanResponse, PlanGenerationRequest
from auth import get_current_active_user
from services.plan_service import PlanService

router = APIRouter()

@router.get("/", response_model=List[PlanResponse])
async def get_user_plans(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's plans."""
    plan_service = PlanService(db)
    plans = plan_service.get_user_plans(current_user.id, skip=skip, limit=limit)
    return plans

@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific plan by ID."""
    plan_service = PlanService(db)
    plan = plan_service.get_plan(plan_id, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return plan

@router.post("/generate", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_plan(
    plan_request: PlanGenerationRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate a new workout or meal plan."""
    plan_service = PlanService(db)
    plan = plan_service.generate_plan(current_user.id, plan_request)
    return plan

@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def create_plan(
    plan_data: PlanCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a custom plan."""
    plan_service = PlanService(db)
    plan = plan_service.create_plan(current_user.id, plan_data)
    return plan

@router.put("/{plan_id}", response_model=PlanResponse)
async def update_plan(
    plan_id: int,
    plan_data: PlanUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an existing plan."""
    plan_service = PlanService(db)
    plan = plan_service.update_plan(plan_id, current_user.id, plan_data)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return plan

@router.delete("/{plan_id}")
async def delete_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a plan."""
    plan_service = PlanService(db)
    success = plan_service.delete_plan(plan_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    return {"message": "Plan deleted successfully"}

@router.get("/current/active", response_model=List[PlanResponse])
async def get_active_plans(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's currently active plans."""
    plan_service = PlanService(db)
    plans = plan_service.get_active_user_plans(current_user.id)
    return plans 