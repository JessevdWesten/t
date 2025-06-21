from sqlalchemy import Column, Integer, String, Float, Text, JSON
from database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    calories = Column(Integer, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    dietary_tags = Column(JSON, nullable=True)  # ['vegetarian', 'gluten_free', 'high_protein']
    instructions = Column(Text, nullable=True)
    # Note: embedding VECTOR(384) field will be handled by pgvector extension in PostgreSQL

    def __repr__(self):
        return f"<Recipe(name='{self.name}', calories={self.calories})>" 