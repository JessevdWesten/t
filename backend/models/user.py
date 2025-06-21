from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class GenderEnum(enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class ActivityLevelEnum(enum.Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    ACTIVE = "active"
    VERY_ACTIVE = "very_active"

class GoalEnum(enum.Enum):
    LOSE_WEIGHT = "lose_weight"
    MAINTAIN = "maintain"
    GAIN_MUSCLE = "gain_muscle"
    IMPROVE_FITNESS = "improve_fitness"

class WorkoutTypeEnum(enum.Enum):
    GYM = "gym"
    HOME = "home"
    BODYWEIGHT = "bodyweight"
    OUTDOOR = "outdoor"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Profile Information
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(Enum(GenderEnum), nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)

    # Lifestyle & Goals
    activity_level = Column(Enum(ActivityLevelEnum), nullable=True)
    goal = Column(Enum(GoalEnum), nullable=True)
    target_weight_kg = Column(Float, nullable=True)

    # Dietary Preferences & Restrictions  
    is_vegetarian = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)
    is_paleo = Column(Boolean, default=False)
    is_keto = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    
    # Allergies (stored as comma-separated string for simplicity)
    allergies = Column(Text, nullable=True)  # e.g., "nuts,dairy,shellfish"
    
    # Fitness Preferences
    preferred_workout_types = Column(Text, nullable=True)  # JSON string of workout types
    available_equipment = Column(Text, nullable=True)  # JSON string of equipment
    workout_days_per_week = Column(Integer, default=3)
    workout_duration_minutes = Column(Integer, default=45)

    # Calculated Values
    bmr = Column(Float, nullable=True)  # Basal Metabolic Rate
    tdee = Column(Float, nullable=True)  # Total Daily Energy Expenditure
    target_calories = Column(Float, nullable=True)

    # Relationships
    plans = relationship("Plan", back_populates="user") 