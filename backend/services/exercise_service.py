from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
import json
from datetime import datetime, timedelta

from models.exercise import Exercise
from schemas.exercise import ExerciseCreate, ExerciseUpdate, ExerciseFilter

class ExerciseService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_exercises(self, skip: int = 0, limit: int = 100, filters: ExerciseFilter = None) -> List[Exercise]:
        """Get list of exercises with optional filtering."""
        query = self.db.query(Exercise)
        
        if filters:
            if filters.muscle_group:
                query = query.filter(Exercise.muscle_group == filters.muscle_group)
            if filters.equipment_needed:
                query = query.filter(Exercise.equipment_needed == filters.equipment_needed)
            if filters.difficulty_level:
                query = query.filter(Exercise.difficulty_level == filters.difficulty_level)
            if filters.exercise_type:
                query = query.filter(Exercise.exercise_type == filters.exercise_type)
            if filters.is_compound is not None:
                query = query.filter(Exercise.is_compound == filters.is_compound)
            if filters.is_active is not None:
                query = query.filter(Exercise.is_active == filters.is_active)
        
        return query.offset(skip).limit(limit).all()
    
    def get_exercise(self, exercise_id: int) -> Optional[Exercise]:
        """Get exercise by ID."""
        return self.db.query(Exercise).filter(Exercise.id == exercise_id, Exercise.is_active == True).first()
    
    def create_exercise(self, exercise_data: ExerciseCreate) -> Exercise:
        """Create a new exercise."""
        # Convert lists to JSON strings
        exercise_dict = exercise_data.dict()
        if exercise_dict.get('secondary_muscles'):
            exercise_dict['secondary_muscles'] = json.dumps([m.value for m in exercise_dict['secondary_muscles']])
        if exercise_dict.get('tags'):
            exercise_dict['tags'] = json.dumps(exercise_dict['tags'])
        
        exercise = Exercise(**exercise_dict)
        self.db.add(exercise)
        self.db.commit()
        self.db.refresh(exercise)
        return exercise
    
    def update_exercise(self, exercise_id: int, exercise_data: ExerciseUpdate) -> Optional[Exercise]:
        """Update an existing exercise."""
        exercise = self.get_exercise(exercise_id)
        if not exercise:
            return None
        
        update_data = exercise_data.dict(exclude_unset=True)
        
        # Handle list fields that need JSON serialization
        if 'secondary_muscles' in update_data and update_data['secondary_muscles']:
            update_data['secondary_muscles'] = json.dumps([m.value for m in update_data['secondary_muscles']])
        if 'tags' in update_data and update_data['tags']:
            update_data['tags'] = json.dumps(update_data['tags'])
        
        for field, value in update_data.items():
            setattr(exercise, field, value)
        
        self.db.commit()
        self.db.refresh(exercise)
        return exercise
    
    def delete_exercise(self, exercise_id: int) -> bool:
        """Delete an exercise (soft delete)."""
        exercise = self.get_exercise(exercise_id)
        if not exercise:
            return False
        
        exercise.is_active = False
        self.db.commit()
        return True
    
    def search_exercises(self, query: str, limit: int = 50) -> List[Exercise]:
        """Search exercises by name or description."""
        search_term = f"%{query}%"
        exercises = self.db.query(Exercise).filter(
            and_(
                Exercise.is_active == True,
                or_(
                    Exercise.name.ilike(search_term),
                    Exercise.description.ilike(search_term),
                    Exercise.instructions.ilike(search_term)
                )
            )
        ).limit(limit).all()
        
        return exercises
    
    def get_exercises_by_muscle_group(self, muscle_group: str, limit: int = 50) -> List[Exercise]:
        """Get exercises filtered by muscle group."""
        return self.db.query(Exercise).filter(
            Exercise.muscle_group == muscle_group,
            Exercise.is_active == True
        ).limit(limit).all()
    
    def get_exercises_by_equipment(self, equipment: str, limit: int = 50) -> List[Exercise]:
        """Get exercises filtered by equipment."""
        return self.db.query(Exercise).filter(
            Exercise.equipment_needed == equipment,
            Exercise.is_active == True
        ).limit(limit).all()
    
    def get_exercises_for_user(self, user_equipment: List[str], difficulty_level: str = None, limit: int = 100) -> List[Exercise]:
        """Get exercises suitable for user's available equipment and difficulty level."""
        query = self.db.query(Exercise).filter(
            Exercise.equipment_needed.in_(user_equipment + ['bodyweight', 'none']),
            Exercise.is_active == True
        )
        
        if difficulty_level:
            query = query.filter(Exercise.difficulty_level == difficulty_level)
        
        return query.limit(limit).all() 