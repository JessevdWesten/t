from sqlalchemy import Column, Integer, String, Text, Boolean, JSON
from database import Base
from enum import Enum

class MuscleGroupEnum(str, Enum):
    CHEST = "chest"
    BACK = "back"
    LEGS = "legs"
    SHOULDERS = "shoulders"
    ARMS = "arms"
    CORE = "core"
    CARDIO = "cardio"
    FULL_BODY = "full_body"

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    muscle_group = Column(String(100), nullable=True, index=True)  # 'chest', 'back', 'legs', 'core', etc.
    secondary_muscles = Column(JSON, nullable=True)  # List of secondary muscle groups
    equipment_needed = Column(String(100), nullable=True, index=True)  # 'bodyweight', 'dumbbell', 'barbell', etc.
    difficulty_level = Column(String(50), nullable=True, index=True)  # 'beginner', 'intermediate', 'advanced'
    exercise_type = Column(String(100), nullable=True)  # 'strength', 'cardio', 'flexibility', etc.
    is_compound = Column(Boolean, default=False)  # True for compound exercises
    
    # Workout parameters
    default_sets = Column(Integer, nullable=True)
    default_reps_min = Column(Integer, nullable=True)
    default_reps_max = Column(Integer, nullable=True)
    default_rest_seconds = Column(Integer, nullable=True)
    
    # Media and instructions
    video_url = Column(String(255), nullable=True)
    instructions = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # Additional tags
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Legacy fields (for backward compatibility)
    equipment = Column(String(100), nullable=True)  # Legacy field
    difficulty = Column(String(50), nullable=True)  # Legacy field
    
    # Note: embedding VECTOR(384) field will be handled by pgvector extension in PostgreSQL

    def __repr__(self):
        return f"<Exercise(name='{self.name}', muscle_group='{self.muscle_group}')>" 