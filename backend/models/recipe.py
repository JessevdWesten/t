from sqlalchemy import Column, Integer, String, Float, Text, JSON, Boolean
from database import Base
from enum import Enum

class MealTypeEnum(str, Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    calories = Column(Integer, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    
    # Recipe details
    meal_type = Column(String(50), nullable=True)  # breakfast, lunch, dinner, snack
    cuisine_type = Column(String(100), nullable=True)
    difficulty = Column(String(50), nullable=True)  # easy, medium, hard
    prep_time_minutes = Column(Integer, nullable=True)
    
    # Ingredients and instructions
    ingredients = Column(JSON, nullable=True)  # List of ingredients as JSON
    instructions = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # General tags
    
    # Dietary flags
    is_vegetarian = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    is_dairy_free = Column(Boolean, default=False)
    is_nut_free = Column(Boolean, default=False)
    is_paleo = Column(Boolean, default=False)
    is_keto = Column(Boolean, default=False)
    is_low_carb = Column(Boolean, default=False)
    is_high_protein = Column(Boolean, default=False)
    is_meal_prep_friendly = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Legacy field (for backward compatibility)
    dietary_tags = Column(JSON, nullable=True)  # ['vegetarian', 'gluten_free', 'high_protein']
    
    # Note: embedding VECTOR(384) field will be handled by pgvector extension in PostgreSQL

    def __repr__(self):
        return f"<Recipe(name='{self.name}', calories={self.calories})>" 