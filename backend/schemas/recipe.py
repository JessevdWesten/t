from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class RecipeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    calories: Optional[int] = Field(None, ge=0)
    protein_g: Optional[float] = Field(None, ge=0)
    carbs_g: Optional[float] = Field(None, ge=0)    
    fat_g: Optional[float] = Field(None, ge=0)
    dietary_tags: Optional[List[str]] = None  # ['vegetarian', 'gluten_free', 'high_protein']
    instructions: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    calories: Optional[int] = Field(None, ge=0)
    protein_g: Optional[float] = Field(None, ge=0)
    carbs_g: Optional[float] = Field(None, ge=0)
    fat_g: Optional[float] = Field(None, ge=0)
    dietary_tags: Optional[List[str]] = None
    instructions: Optional[str] = None

class RecipeResponse(RecipeBase):
    id: int

    class Config:
        orm_mode = True

class RecipeFilter(BaseModel):
    max_calories: Optional[int] = Field(None, ge=0)
    min_protein: Optional[float] = Field(None, ge=0)
    dietary_tags: Optional[List[str]] = None 