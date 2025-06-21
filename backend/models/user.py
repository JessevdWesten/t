from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum

class GenderEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class ActivityLevelEnum(str, Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    ACTIVE = "active"
    VERY_ACTIVE = "very_active"

class GoalEnum(str, Enum):
    LOSE_WEIGHT = "weight_loss"
    MAINTAIN = "maintenance"
    GAIN_MUSCLE = "muscle_gain"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive
    
    # Profile fields
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    height_cm = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    activity_level = Column(String(50), nullable=True)
    goal = Column(String(50), nullable=True)
    
    # Calculated fields
    bmr = Column(Float, nullable=True)
    tdee = Column(Float, nullable=True)
    target_calories = Column(Float, nullable=True)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    generated_plans = relationship("GeneratedPlan", back_populates="user")
    feedback_logs = relationship("UserFeedbackLog", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    first_name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)  # 'male', 'female', 'other'
    height_cm = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    activity_level = Column(String(50), nullable=True)  # 'sedentary', 'light', 'moderate', 'active', 'very_active'
    goal = Column(String(50), nullable=True)  # 'weight_loss', 'maintenance', 'muscle_gain'
    preferences = Column(JSON, nullable=True)  # {'diet': 'vegetarian', 'allergies': ['nuts'], 'equipment': ['dumbbells', 'kettlebell']}
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile") 