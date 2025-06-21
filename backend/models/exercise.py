from sqlalchemy import Column, Integer, String, Text
from database import Base

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    muscle_group = Column(String(100), nullable=True, index=True)  # 'chest', 'back', 'legs', 'core', etc.
    equipment = Column(String(100), nullable=True, index=True)  # 'bodyweight', 'dumbbell', 'barbell', etc.
    difficulty = Column(String(50), nullable=True, index=True)  # 'beginner', 'intermediate', 'advanced'
    video_url = Column(String(255), nullable=True)
    # Note: embedding VECTOR(384) field will be handled by pgvector extension in PostgreSQL

    def __repr__(self):
        return f"<Exercise(name='{self.name}', muscle_group='{self.muscle_group}')>" 