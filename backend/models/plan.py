from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

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