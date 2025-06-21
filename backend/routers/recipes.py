from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.recipe import Recipe
from ..schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse, RecipeFilter
from ..auth import get_current_active_user
from ..services.recipe_service import RecipeService

router = APIRouter()

@router.get("/", response_model=List[RecipeResponse])
async def get_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    filters: RecipeFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get list of recipes with optional filtering."""
    recipe_service = RecipeService(db)
    recipes = recipe_service.get_recipes(skip=skip, limit=limit, filters=filters)
    return recipes

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """Get a specific recipe by ID."""
    recipe_service = RecipeService(db)
    recipe = recipe_service.get_recipe(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return recipe

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe_data: RecipeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)  # Admin only in production
):
    """Create a new recipe."""
    recipe_service = RecipeService(db)
    recipe = recipe_service.create_recipe(recipe_data)
    return recipe

@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)  # Admin only in production
):
    """Update an existing recipe."""
    recipe_service = RecipeService(db)
    recipe = recipe_service.update_recipe(recipe_id, recipe_data)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return recipe

@router.delete("/{recipe_id}")
async def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)  # Admin only in production
):
    """Delete a recipe (soft delete)."""
    recipe_service = RecipeService(db)
    success = recipe_service.delete_recipe(recipe_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return {"message": "Recipe deleted successfully"}

@router.get("/search/{query}", response_model=List[RecipeResponse])
async def search_recipes(
    query: str,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search recipes by name, ingredients, or description."""
    recipe_service = RecipeService(db)
    recipes = recipe_service.search_recipes(query, limit)
    return recipes

@router.get("/by-meal-type/{meal_type}", response_model=List[RecipeResponse])
async def get_recipes_by_meal_type(
    meal_type: str,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get recipes filtered by meal type."""
    recipe_service = RecipeService(db)
    recipes = recipe_service.get_recipes_by_meal_type(meal_type, limit)
    return recipes 