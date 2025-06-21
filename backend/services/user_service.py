from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from datetime import date
import json

from models.user import User, ActivityLevelEnum, GoalEnum, GenderEnum
from schemas.user import UserProfileUpdate

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def update_user_profile(self, user_id: int, profile_data: UserProfileUpdate) -> User:
        """Update user profile and recalculate metrics."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Update profile fields
        update_data = profile_data.dict(exclude_unset=True)
        
        # Handle list fields that need JSON serialization
        if 'preferred_workout_types' in update_data:
            update_data['preferred_workout_types'] = json.dumps([t.value for t in update_data['preferred_workout_types']])
        if 'available_equipment' in update_data:
            update_data['available_equipment'] = json.dumps(update_data['available_equipment'])
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        # Recalculate metrics if relevant data changed
        if any(field in update_data for field in ['age', 'gender', 'height_cm', 'weight_kg', 'activity_level', 'goal']):
            self._calculate_user_metrics(user)
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate user account."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        user.is_active = False
        self.db.commit()
        return True
    
    def _calculate_user_metrics(self, user: User) -> None:
        """Calculate BMR, TDEE, and target calories using Mifflin-St Jeor equation."""
        if not all([user.age, user.gender, user.height_cm, user.weight_kg]):
            return
        
        # Mifflin-St Jeor Equation for BMR
        if user.gender == GenderEnum.MALE:
            bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age + 5
        else:  # FEMALE or OTHER
            bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age - 161
        
        user.bmr = round(bmr, 2)
        
        # Calculate TDEE based on activity level
        activity_multipliers = {
            ActivityLevelEnum.SEDENTARY: 1.2,
            ActivityLevelEnum.LIGHT: 1.375,
            ActivityLevelEnum.MODERATE: 1.55,
            ActivityLevelEnum.ACTIVE: 1.725,
            ActivityLevelEnum.VERY_ACTIVE: 1.9
        }
        
        if user.activity_level:
            tdee = bmr * activity_multipliers.get(user.activity_level, 1.2)
            user.tdee = round(tdee, 2)
            
            # Calculate target calories based on goal
            if user.goal == GoalEnum.LOSE_WEIGHT:
                target_calories = tdee - 500  # 500 calorie deficit for 1 lb/week loss
            elif user.goal == GoalEnum.GAIN_MUSCLE:
                target_calories = tdee + 300  # 300 calorie surplus for muscle gain
            else:  # MAINTAIN or IMPROVE_FITNESS
                target_calories = tdee
            
            user.target_calories = round(target_calories, 2)
    
    def calculate_bmi(self, user: User) -> Optional[float]:
        """Calculate BMI for a user."""
        if not user.weight_kg or not user.height_cm:
            return None
        
        height_m = user.height_cm / 100
        bmi = user.weight_kg / (height_m ** 2)
        return round(bmi, 2)
    
    def get_user_macros(self, user: User) -> dict:
        """Calculate recommended macronutrient distribution."""
        if not user.target_calories:
            return {}
        
        # Standard macro distribution based on goal
        if user.goal == GoalEnum.LOSE_WEIGHT:
            protein_pct, carb_pct, fat_pct = 0.35, 0.30, 0.35
        elif user.goal == GoalEnum.GAIN_MUSCLE:
            protein_pct, carb_pct, fat_pct = 0.30, 0.45, 0.25
        else:  # MAINTAIN or IMPROVE_FITNESS
            protein_pct, carb_pct, fat_pct = 0.25, 0.50, 0.25
        
        return {
            "protein_g": round((user.target_calories * protein_pct) / 4, 2),  # 4 cal/g
            "carbs_g": round((user.target_calories * carb_pct) / 4, 2),      # 4 cal/g
            "fat_g": round((user.target_calories * fat_pct) / 9, 2)          # 9 cal/g
        } 