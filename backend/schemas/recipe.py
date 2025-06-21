from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class RecipeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    calories: Optional[int] = Field(None, ge=0)
    protein_g: Optional[float] = Field(None, ge=0)
    carbs_g: Optional[float] = Field(None, ge=0)    
    fat_g: Optional[float] = Field(None, ge=0)
    
    # Recipe details
    meal_type: Optional[str] = None  # breakfast, lunch, dinner, snack
    cuisine_type: Optional[str] = None
    difficulty: Optional[str] = None  # easy, medium, hard
    prep_time_minutes: Optional[int] = Field(None, ge=0)
    
    # Content
    ingredients: Optional[List[Dict[str, Any]]] = None
    instructions: Optional[str] = None
    tags: Optional[List[str]] = None
    
    # Dietary flags
    is_vegetarian: Optional[bool] = False
    is_vegan: Optional[bool] = False
    is_gluten_free: Optional[bool] = False
    is_dairy_free: Optional[bool] = False
    is_nut_free: Optional[bool] = False
    is_paleo: Optional[bool] = False
    is_keto: Optional[bool] = False
    is_low_carb: Optional[bool] = False
    is_high_protein: Optional[bool] = False
    is_meal_prep_friendly: Optional[bool] = False
    
    # Legacy field
    dietary_tags: Optional[List[str]] = None  # ['vegetarian', 'gluten_free', 'high_protein']

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    calories: Optional[int] = Field(None, ge=0)
    protein_g: Optional[float] = Field(None, ge=0)
    carbs_g: Optional[float] = Field(None, ge=0)
    fat_g: Optional[float] = Field(None, ge=0)
    
    # Recipe details
    meal_type: Optional[str] = None
    cuisine_type: Optional[str] = None
    difficulty: Optional[str] = None
    prep_time_minutes: Optional[int] = Field(None, ge=0)
    
    # Content
    ingredients: Optional[List[Dict[str, Any]]] = None
    instructions: Optional[str] = None
    tags: Optional[List[str]] = None
    
    # Dietary flags
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    is_dairy_free: Optional[bool] = None
    is_nut_free: Optional[bool] = None
    is_paleo: Optional[bool] = None
    is_keto: Optional[bool] = None
    is_low_carb: Optional[bool] = None
    is_high_protein: Optional[bool] = None
    is_meal_prep_friendly: Optional[bool] = None
    
    # Legacy field
    dietary_tags: Optional[List[str]] = None

class RecipeResponse(RecipeBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class RecipeFilter(BaseModel):
    meal_type: Optional[str] = None
    cuisine_type: Optional[str] = None
    difficulty: Optional[str] = None
    max_calories: Optional[int] = Field(None, ge=0)
    min_protein: Optional[float] = Field(None, ge=0)
    max_prep_time: Optional[int] = Field(None, ge=0)
    
    # Dietary filters
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    is_dairy_free: Optional[bool] = None
    is_nut_free: Optional[bool] = None
    is_paleo: Optional[bool] = None
    is_keto: Optional[bool] = None
    is_low_carb: Optional[bool] = None
    is_high_protein: Optional[bool] = None
    is_meal_prep_friendly: Optional[bool] = None
    is_active: Optional[bool] = None
    
    # Legacy field
    dietary_tags: Optional[List[str]] = None 