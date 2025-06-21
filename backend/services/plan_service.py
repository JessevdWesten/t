from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import random

from models.plan import Plan, PlanTypeEnum, PlanStatusEnum
from models.user import User, GoalEnum
from schemas.plan import PlanCreate, PlanUpdate, PlanGenerationRequest
from services.exercise_service import ExerciseService
from services.recipe_service import RecipeService
from services.user_service import UserService

class PlanService:
    def __init__(self, db: Session):
        self.db = db
        self.exercise_service = ExerciseService(db)
        self.recipe_service = RecipeService(db)
        self.user_service = UserService(db)
    
    def get_user_plans(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Plan]:
        """Get user's plans."""
        return self.db.query(Plan).filter(
            Plan.user_id == user_id,
            Plan.is_active == True
        ).offset(skip).limit(limit).all()
    
    def get_plan(self, plan_id: int, user_id: int) -> Optional[Plan]:
        """Get a specific plan by ID."""
        return self.db.query(Plan).filter(
            Plan.id == plan_id,
            Plan.user_id == user_id,
            Plan.is_active == True
        ).first()
    
    def create_plan(self, user_id: int, plan_data: PlanCreate) -> Plan:
        """Create a custom plan."""
        plan = Plan(
            user_id=user_id,
            name=plan_data.name,
            description=plan_data.description,
            plan_type=plan_data.plan_type,
            start_date=plan_data.start_date,
            duration_weeks=plan_data.duration_weeks,
            plan_data=json.dumps(plan_data.plan_data)
        )
        
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan
    
    def update_plan(self, plan_id: int, user_id: int, plan_data: PlanUpdate) -> Optional[Plan]:
        """Update an existing plan."""
        plan = self.get_plan(plan_id, user_id)
        if not plan:
            return None
        
        update_data = plan_data.dict(exclude_unset=True)
        
        if 'plan_data' in update_data:
            update_data['plan_data'] = json.dumps(update_data['plan_data'])
        
        for field, value in update_data.items():
            setattr(plan, field, value)
        
        self.db.commit()
        self.db.refresh(plan)
        return plan
    
    def delete_plan(self, plan_id: int, user_id: int) -> bool:
        """Delete a plan."""
        plan = self.get_plan(plan_id, user_id)
        if not plan:
            return False
        
        plan.is_active = False
        self.db.commit()
        return True
    
    def get_active_user_plans(self, user_id: int) -> List[Plan]:
        """Get user's currently active plans."""
        return self.db.query(Plan).filter(
            Plan.user_id == user_id,
            Plan.status == PlanStatusEnum.ACTIVE,
            Plan.is_active == True
        ).all()
    
    def generate_plan(self, user_id: int, plan_request: PlanGenerationRequest) -> Plan:
        """Generate a new workout or meal plan using rule-based logic."""
        user = self.user_service.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        if plan_request.plan_type == PlanTypeEnum.WORKOUT:
            plan_data = self._generate_workout_plan(user, plan_request)
        else:  # MEAL
            plan_data = self._generate_meal_plan(user, plan_request)
        
        # Create the plan
        start_date = plan_request.start_date or datetime.utcnow()
        plan_name = f"{plan_request.plan_type.value.title()} Plan - {start_date.strftime('%Y-%m-%d')}"
        
        plan = Plan(
            user_id=user_id,
            name=plan_name,
            description=f"Generated {plan_request.plan_type.value} plan based on user preferences",
            plan_type=plan_request.plan_type,
            start_date=start_date,
            duration_weeks=plan_request.duration_weeks,
            plan_data=json.dumps(plan_data)
        )
        
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan
    
    def _generate_workout_plan(self, user: User, plan_request: PlanGenerationRequest) -> Dict[str, Any]:
        """Generate a workout plan using rule-based logic."""
        # Get user equipment and preferences
        available_equipment = json.loads(user.available_equipment) if user.available_equipment else ['bodyweight']
        workout_days = user.workout_days_per_week or 3
        workout_duration = user.workout_duration_minutes or 45
        
        # Determine difficulty based on goal and user info
        if user.goal == GoalEnum.LOSE_WEIGHT:
            difficulty = 'beginner'
        elif user.goal == GoalEnum.GAIN_MUSCLE:
            difficulty = 'intermediate'
        else:
            difficulty = 'beginner'
        
        # Get suitable exercises
        exercises = self.exercise_service.get_exercises_for_user(
            available_equipment, difficulty, limit=50
        )
        
        if not exercises:
            exercises = self.exercise_service.get_exercises_for_user(
                ['bodyweight'], difficulty, limit=20
            )
        
        # Generate weekly workout schedule
        weekly_plan = {}
        
        # Define workout split based on days per week
        if workout_days <= 3:
            split = ['full_body'] * workout_days
        elif workout_days == 4:
            split = ['upper_body', 'lower_body', 'upper_body', 'lower_body']
        else:  # 5+ days
            split = ['chest', 'back', 'legs', 'shoulders', 'arms'][:workout_days]
        
        for week in range(plan_request.duration_weeks):
            week_key = f"week_{week + 1}"
            weekly_plan[week_key] = {}
            
            for day, focus in enumerate(split, 1):
                day_key = f"day_{day}"
                
                # Select exercises for this day
                if focus == 'full_body':
                    day_exercises = self._select_full_body_exercises(exercises)
                else:
                    day_exercises = self._select_exercises_by_muscle_group(exercises, focus)
                
                weekly_plan[week_key][day_key] = {
                    'focus': focus,
                    'duration_minutes': workout_duration,
                    'exercises': day_exercises
                }
        
        return {
            'type': 'workout',
            'duration_weeks': plan_request.duration_weeks,
            'workout_days_per_week': workout_days,
            'weekly_plan': weekly_plan,
            'equipment_used': available_equipment,
            'difficulty_level': difficulty
        }
    
    def _generate_meal_plan(self, user: User, plan_request: PlanGenerationRequest) -> Dict[str, Any]:
        """Generate a meal plan using rule-based logic."""
        # Get user dietary preferences
        user_preferences = {
            'is_vegetarian': user.is_vegetarian,
            'is_vegan': user.is_vegan,
            'is_gluten_free': user.is_gluten_free,
            'is_paleo': user.is_paleo,
            'is_keto': user.is_keto,
            'allergies': user.allergies.split(',') if user.allergies else []
        }
        
        # Get suitable recipes
        recipes = self.recipe_service.get_recipes_for_user(
            user_preferences, user.target_calories, limit=100
        )
        
        if not recipes:
            # Fallback to basic recipes if no matches
            recipes = self.recipe_service.get_recipes(limit=50)
        
        # Group recipes by meal type
        recipes_by_meal = {
            'breakfast': [r for r in recipes if r.meal_type.value == 'breakfast'],
            'lunch': [r for r in recipes if r.meal_type.value == 'lunch'],
            'dinner': [r for r in recipes if r.meal_type.value == 'dinner'],
            'snack': [r for r in recipes if r.meal_type.value == 'snack']
        }
        
        # Generate daily meal plans
        daily_plans = {}
        days_per_week = 7
        
        for week in range(plan_request.duration_weeks):
            for day in range(1, days_per_week + 1):
                day_key = f"week_{week + 1}_day_{day}"
                
                # Calculate target calories per meal
                daily_calories = user.target_calories or 2000
                breakfast_cal = daily_calories * 0.25
                lunch_cal = daily_calories * 0.35
                dinner_cal = daily_calories * 0.35
                snack_cal = daily_calories * 0.05
                
                daily_plans[day_key] = {
                    'date': (datetime.utcnow() + timedelta(weeks=week, days=day-1)).strftime('%Y-%m-%d'),
                    'target_calories': daily_calories,
                    'meals': {
                        'breakfast': self._select_meal(recipes_by_meal['breakfast'], breakfast_cal),
                        'lunch': self._select_meal(recipes_by_meal['lunch'], lunch_cal),
                        'dinner': self._select_meal(recipes_by_meal['dinner'], dinner_cal),
                        'snack': self._select_meal(recipes_by_meal['snack'], snack_cal) if recipes_by_meal['snack'] else None
                    }
                }
        
        return {
            'type': 'meal',
            'duration_weeks': plan_request.duration_weeks,
            'target_calories_per_day': user.target_calories,
            'dietary_preferences': user_preferences,
            'daily_plans': daily_plans,
            'macros': self.user_service.get_user_macros(user)
        }
    
    def _select_full_body_exercises(self, exercises: List) -> List[Dict]:
        """Select exercises for a full-body workout."""
        muscle_groups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
        selected = []
        
        for muscle_group in muscle_groups:
            suitable = [e for e in exercises if muscle_group in e.muscle_group.value]
            if suitable:
                exercise = random.choice(suitable)
                selected.append({
                    'id': exercise.id,
                    'name': exercise.name,
                    'muscle_group': exercise.muscle_group.value,
                    'sets': exercise.default_sets,
                    'reps': f"{exercise.default_reps_min}-{exercise.default_reps_max}" if exercise.default_reps_min else "As indicated",
                    'rest_seconds': exercise.default_rest_seconds
                })
        
        return selected
    
    def _select_exercises_by_muscle_group(self, exercises: List, focus: str) -> List[Dict]:
        """Select exercises focused on specific muscle group."""
        suitable = [e for e in exercises if focus in e.muscle_group.value or e.muscle_group.value == focus]
        
        if not suitable:
            suitable = exercises[:5]  # Fallback
        
        selected = []
        for exercise in random.sample(suitable, min(4, len(suitable))):
            selected.append({
                'id': exercise.id,
                'name': exercise.name,
                'muscle_group': exercise.muscle_group.value,
                'sets': exercise.default_sets,
                'reps': f"{exercise.default_reps_min}-{exercise.default_reps_max}" if exercise.default_reps_min else "As indicated",
                'rest_seconds': exercise.default_rest_seconds
            })
        
        return selected
    
    def _select_meal(self, recipes: List, target_calories: float) -> Optional[Dict]:
        """Select a recipe that best fits the target calories."""
        if not recipes:
            return None
        
        # Find recipe closest to target calories
        best_recipe = min(recipes, key=lambda r: abs(r.calories - target_calories))
        
        return {
            'id': best_recipe.id,
            'name': best_recipe.name,
            'calories': best_recipe.calories,
            'protein_g': best_recipe.protein_g,
            'carbs_g': best_recipe.carbs_g,
            'fat_g': best_recipe.fat_g,
            'prep_time_minutes': best_recipe.prep_time_minutes,
            'servings': best_recipe.servings,
            'ingredients': json.loads(best_recipe.ingredients) if best_recipe.ingredients else [],
            'instructions': best_recipe.instructions
        } 