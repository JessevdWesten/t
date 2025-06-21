from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from database import Base

class PlanTypeEnum(enum.Enum):
    WORKOUT = "workout"
    MEAL = "meal"

class PlanStatusEnum(enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"

class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Plan Details
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    plan_type = Column(Enum(PlanTypeEnum), nullable=False)
    status = Column(Enum(PlanStatusEnum), default=PlanStatusEnum.ACTIVE)
    
    # Timing
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    duration_weeks = Column(Integer, default=1)
    
    # Plan Content (stored as JSON for flexibility)
    plan_data = Column(Text, nullable=False)  # JSON containing workout/meal details
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # User Progress Tracking
    completion_percentage = Column(Float, default=0.0)
    user_rating = Column(Integer, nullable=True)  # 1-5 stars
    user_feedback = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="plans")

    def __repr__(self):
        return f"<Plan(name='{self.name}', type='{self.plan_type}', user_id={self.user_id})>" 