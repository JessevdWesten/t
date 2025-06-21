from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserResponse, UserProfileUpdate
from ..auth import get_current_active_user
from ..services.user_service import UserService

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get user profile information."""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user profile information."""
    user_service = UserService(db)
    updated_user = user_service.update_user_profile(current_user.id, profile_data)
    return updated_user

@router.delete("/profile")
async def delete_user_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete user account (soft delete)."""
    user_service = UserService(db)
    user_service.deactivate_user(current_user.id)
    return {"message": "Account deactivated successfully"}

@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_active_user)):
    """Get user statistics and calculated metrics."""
    return {
        "bmr": current_user.bmr,
        "tdee": current_user.tdee,
        "target_calories": current_user.target_calories,
        "bmi": calculate_bmi(current_user.weight_kg, current_user.height_cm) if current_user.weight_kg and current_user.height_cm else None
    }

def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Calculate BMI from weight and height."""
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 2) 