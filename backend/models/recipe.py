from sqlalchemy import Column, Integer, String, Float, Boolean, Text, Enum
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class MealTypeEnum(enum.Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class CuisineEnum(enum.Enum):
    AMERICAN = "american"
    ITALIAN = "italian"
    MEXICAN = "mexican"
    ASIAN = "asian"
    INDIAN = "indian"
    MEDITERRANEAN = "mediterranean"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    OTHER = "other"

class DifficultyEnum(enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=False)
    
    # Basic Info
    servings = Column(Integer, default=1)
    prep_time_minutes = Column(Integer, nullable=True)
    cook_time_minutes = Column(Integer, nullable=True)
    total_time_minutes = Column(Integer, nullable=True)
    difficulty = Column(Enum(DifficultyEnum), default=DifficultyEnum.EASY)
    
    # Categorization
    meal_type = Column(Enum(MealTypeEnum), nullable=False, index=True)
    cuisine_type = Column(Enum(CuisineEnum), default=CuisineEnum.OTHER)
    
    # Nutritional Information (per serving)
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    fiber_g = Column(Float, nullable=True)
    sugar_g = Column(Float, nullable=True)
    sodium_mg = Column(Float, nullable=True)
    
    # Ingredients (stored as JSON string for simplicity)
    ingredients = Column(Text, nullable=False)  # JSON list of ingredients with quantities
    
    # Dietary Tags
    is_vegetarian = Column(Boolean, default=False, index=True)
    is_vegan = Column(Boolean, default=False, index=True)
    is_gluten_free = Column(Boolean, default=False, index=True)
    is_dairy_free = Column(Boolean, default=False, index=True)
    is_nut_free = Column(Boolean, default=False, index=True)
    is_paleo = Column(Boolean, default=False, index=True)
    is_keto = Column(Boolean, default=False, index=True)
    is_low_carb = Column(Boolean, default=False, index=True)
    is_high_protein = Column(Boolean, default=False, index=True)
    
    # Media & Resources
    image_url = Column(String, nullable=True)
    recipe_url = Column(String, nullable=True)  # Source URL if scraped
    
    # Metadata  
    is_active = Column(Boolean, default=True)
    tags = Column(Text, nullable=True)  # JSON string for additional tags
    rating = Column(Float, nullable=True)  # Average user rating
    
    # Cost and convenience
    estimated_cost = Column(Float, nullable=True)  # Estimated cost per serving
    is_meal_prep_friendly = Column(Boolean, default=False)

    def __repr__(self):
        return f"<Recipe(name='{self.name}', calories={self.calories}, meal_type='{self.meal_type}')>" 