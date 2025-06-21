from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from models.recipe import MealTypeEnum, CuisineEnum, DifficultyEnum

class RecipeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    instructions: str = Field(..., min_length=1)
    servings: int = Field(1, ge=1, le=20)
    meal_type: MealTypeEnum
    calories: float = Field(..., ge=0)

class RecipeCreate(RecipeBase):
    prep_time_minutes: Optional[int] = Field(None, ge=0)
    cook_time_minutes: Optional[int] = Field(None, ge=0)
    total_time_minutes: Optional[int] = Field(None, ge=0)
    difficulty: Optional[DifficultyEnum] = DifficultyEnum.EASY
    cuisine_type: Optional[CuisineEnum] = CuisineEnum.OTHER
    
    # Nutritional Information
    protein_g: Optional[float] = Field(None, ge=0)
    carbs_g: Optional[float] = Field(None, ge=0)
    fat_g: Optional[float] = Field(None, ge=0)
    fiber_g: Optional[float] = Field(None, ge=0)
    sugar_g: Optional[float] = Field(None, ge=0)
    sodium_mg: Optional[float] = Field(None, ge=0)
    
    # Ingredients
    ingredients: List[Dict[str, str]] = Field(..., min_items=1)
    
    # Dietary Tags
    is_vegetarian: Optional[bool] = False
    is_vegan: Optional[bool] = False
    is_gluten_free: Optional[bool] = False
    is_dairy_free: Optional[bool] = False
    is_nut_free: Optional[bool] = False
    is_paleo: Optional[bool] = False
    is_keto: Optional[bool] = False
    is_low_carb: Optional[bool] = False
    is_high_protein: Optional[bool] = False
    
    # Media & Metadata
    image_url: Optional[str] = None
    recipe_url: Optional[str] = None
    tags: Optional[List[str]] = None
    estimated_cost: Optional[float] = Field(None, ge=0)
    is_meal_prep_friendly: Optional[bool] = False

class RecipeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = Field(None, min_length=1)
    servings: Optional[int] = Field(None, ge=1, le=20)
    meal_type: Optional[MealTypeEnum] = None
    calories: Optional[float] = Field(None, ge=0)
    prep_time_minutes: Optional[int] = Field(None, ge=0)
    cook_time_minutes: Optional[int] = Field(None, ge=0)
    total_time_minutes: Optional[int] = Field(None, ge=0)
    difficulty: Optional[DifficultyEnum] = None
    cuisine_type: Optional[CuisineEnum] = None
    
    # Nutritional Information
    protein_g: Optional[float] = Field(None, ge=0)
    carbs_g: Optional[float] = Field(None, ge=0)
    fat_g: Optional[float] = Field(None, ge=0)
    fiber_g: Optional[float] = Field(None, ge=0)
    sugar_g: Optional[float] = Field(None, ge=0)
    sodium_mg: Optional[float] = Field(None, ge=0)
    
    # Ingredients
    ingredients: Optional[List[Dict[str, str]]] = None
    
    # Dietary Tags
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    is_dairy_free: Optional[bool] = None
    is_nut_free: Optional[bool] = None
    is_paleo: Optional[bool] = None
    is_keto: Optional[bool] = None
    is_low_carb: Optional[bool] = None
    is_high_protein: Optional[bool] = None
    
    # Media & Metadata
    image_url: Optional[str] = None
    recipe_url: Optional[str] = None
    tags: Optional[List[str]] = None
    estimated_cost: Optional[float] = Field(None, ge=0)
    is_meal_prep_friendly: Optional[bool] = None
    is_active: Optional[bool] = None

class RecipeResponse(RecipeBase):
    id: int
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    total_time_minutes: Optional[int] = None
    difficulty: DifficultyEnum
    cuisine_type: CuisineEnum
    
    # Nutritional Information
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    
    # Ingredients
    ingredients: List[Dict[str, str]]
    
    # Dietary Tags
    is_vegetarian: bool
    is_vegan: bool
    is_gluten_free: bool
    is_dairy_free: bool
    is_nut_free: bool
    is_paleo: bool
    is_keto: bool
    is_low_carb: bool
    is_high_protein: bool
    
    # Media & Metadata
    image_url: Optional[str] = None
    recipe_url: Optional[str] = None
    tags: Optional[List[str]] = None
    rating: Optional[float] = None
    estimated_cost: Optional[float] = None
    is_meal_prep_friendly: bool
    is_active: bool

    class Config:
        orm_mode = True

class RecipeFilter(BaseModel):
    meal_type: Optional[MealTypeEnum] = None
    cuisine_type: Optional[CuisineEnum] = None
    difficulty: Optional[DifficultyEnum] = None
    max_calories: Optional[float] = Field(None, ge=0)
    min_protein: Optional[float] = Field(None, ge=0)
    max_prep_time: Optional[int] = Field(None, ge=0)
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
    is_active: Optional[bool] = True 