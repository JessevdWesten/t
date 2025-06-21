from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Date, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum

class PlanTypeEnum(str, Enum):
    WORKOUT = "workout"
    MEAL = "meal"

class PlanStatusEnum(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    plan_type = Column(String(50), nullable=False)  # workout, meal
    status = Column(String(50), default="draft")  # draft, active, completed, paused
    start_date = Column(Date, nullable=True)
    duration_weeks = Column(Integer, nullable=True)
    plan_data = Column(JSON, nullable=True)  # The actual plan content
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="plans")

    def __repr__(self):
        return f"<Plan(name='{self.name}', plan_type='{self.plan_type}', user_id={self.user_id})>"

class GeneratedPlan(Base):
    __tablename__ = "generated_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    plan_type = Column(String(50), nullable=True)  # 'workout', 'meal'
    start_date = Column(Date, nullable=True)
    plan_data = Column(JSON, nullable=True)  # {'monday': [...], 'tuesday': [...]}
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="generated_plans")

    def __repr__(self):
        return f"<GeneratedPlan(plan_type='{self.plan_type}', user_id={self.user_id})>"

class UserFeedbackLog(Base):
    __tablename__ = "user_feedback_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    plan_id = Column(Integer, ForeignKey("generated_plans.id"), nullable=True)
    item_id = Column(Integer, nullable=True)  # exercise_id or recipe_id
    feedback_type = Column(String(50), nullable=True)  # 'completed', 'skipped', 'too_hard', 'liked'
    feedback_value = Column(Integer, nullable=True)  # 1 for positive, -1 for negative
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="feedback_logs")
    plan = relationship("GeneratedPlan")

    def __repr__(self):
        return f"<UserFeedbackLog(user_id={self.user_id}, feedback_type='{self.feedback_type}')>" 