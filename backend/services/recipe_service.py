from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
import json

from ..models.recipe import Recipe, MealTypeEnum
from ..schemas.recipe import RecipeCreate, RecipeUpdate, RecipeFilter

class RecipeService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_recipes(self, skip: int = 0, limit: int = 100, filters: RecipeFilter = None) -> List[Recipe]:
        """Get list of recipes with optional filtering."""
        query = self.db.query(Recipe)
        
        if filters:
            if filters.meal_type:
                query = query.filter(Recipe.meal_type == filters.meal_type)
            if filters.cuisine_type:
                query = query.filter(Recipe.cuisine_type == filters.cuisine_type)
            if filters.difficulty:
                query = query.filter(Recipe.difficulty == filters.difficulty)
            if filters.max_calories:
                query = query.filter(Recipe.calories <= filters.max_calories)
            if filters.min_protein:
                query = query.filter(Recipe.protein_g >= filters.min_protein)
            if filters.max_prep_time:
                query = query.filter(Recipe.prep_time_minutes <= filters.max_prep_time)
            
            # Dietary filters
            if filters.is_vegetarian is not None:
                query = query.filter(Recipe.is_vegetarian == filters.is_vegetarian)
            if filters.is_vegan is not None:
                query = query.filter(Recipe.is_vegan == filters.is_vegan)
            if filters.is_gluten_free is not None:
                query = query.filter(Recipe.is_gluten_free == filters.is_gluten_free)
            if filters.is_dairy_free is not None:
                query = query.filter(Recipe.is_dairy_free == filters.is_dairy_free)
            if filters.is_nut_free is not None:
                query = query.filter(Recipe.is_nut_free == filters.is_nut_free)
            if filters.is_paleo is not None:
                query = query.filter(Recipe.is_paleo == filters.is_paleo)
            if filters.is_keto is not None:
                query = query.filter(Recipe.is_keto == filters.is_keto)
            if filters.is_low_carb is not None:
                query = query.filter(Recipe.is_low_carb == filters.is_low_carb)
            if filters.is_high_protein is not None:
                query = query.filter(Recipe.is_high_protein == filters.is_high_protein)
            if filters.is_meal_prep_friendly is not None:
                query = query.filter(Recipe.is_meal_prep_friendly == filters.is_meal_prep_friendly)
            if filters.is_active is not None:
                query = query.filter(Recipe.is_active == filters.is_active)
        
        return query.offset(skip).limit(limit).all()
    
    def get_recipe(self, recipe_id: int) -> Optional[Recipe]:
        """Get recipe by ID."""
        return self.db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.is_active == True).first()
    
    def create_recipe(self, recipe_data: RecipeCreate) -> Recipe:
        """Create a new recipe."""
        # Convert ingredients list to JSON string
        recipe_dict = recipe_data.dict()
        recipe_dict['ingredients'] = json.dumps(recipe_dict['ingredients'])
        
        if recipe_dict.get('tags'):
            recipe_dict['tags'] = json.dumps(recipe_dict['tags'])
        
        recipe = Recipe(**recipe_dict)
        self.db.add(recipe)
        self.db.commit()
        self.db.refresh(recipe)
        return recipe
    
    def update_recipe(self, recipe_id: int, recipe_data: RecipeUpdate) -> Optional[Recipe]:
        """Update an existing recipe."""
        recipe = self.get_recipe(recipe_id)
        if not recipe:
            return None
        
        update_data = recipe_data.dict(exclude_unset=True)
        
        # Handle list fields that need JSON serialization
        if 'ingredients' in update_data and update_data['ingredients']:
            update_data['ingredients'] = json.dumps(update_data['ingredients'])
        if 'tags' in update_data and update_data['tags']:
            update_data['tags'] = json.dumps(update_data['tags'])
        
        for field, value in update_data.items():
            setattr(recipe, field, value)
        
        self.db.commit()
        self.db.refresh(recipe)
        return recipe
    
    def delete_recipe(self, recipe_id: int) -> bool:
        """Delete a recipe (soft delete)."""
        recipe = self.get_recipe(recipe_id)
        if not recipe:
            return False
        
        recipe.is_active = False
        self.db.commit()
        return True
    
    def search_recipes(self, query: str, limit: int = 50) -> List[Recipe]:
        """Search recipes by name, ingredients, or description."""
        search_term = f"%{query}%"
        recipes = self.db.query(Recipe).filter(
            and_(
                Recipe.is_active == True,
                or_(
                    Recipe.name.ilike(search_term),
                    Recipe.description.ilike(search_term),
                    Recipe.ingredients.ilike(search_term),
                    Recipe.instructions.ilike(search_term)
                )
            )
        ).limit(limit).all()
        
        return recipes
    
    def get_recipes_by_meal_type(self, meal_type: str, limit: int = 20) -> List[Recipe]:
        """Get recipes filtered by meal type."""
        try:
            meal_enum = MealTypeEnum(meal_type.lower())
        except ValueError:
            return []
        
        return self.db.query(Recipe).filter(
            Recipe.meal_type == meal_enum,
            Recipe.is_active == True
        ).limit(limit).all()
    
    def get_recipes_for_user(self, user_preferences: dict, target_calories: float = None, limit: int = 100) -> List[Recipe]:
        """Get recipes suitable for user's dietary preferences and calorie goals."""
        query = self.db.query(Recipe).filter(Recipe.is_active == True)
        
        # Apply dietary filters
        if user_preferences.get('is_vegetarian'):
            query = query.filter(Recipe.is_vegetarian == True)
        if user_preferences.get('is_vegan'):
            query = query.filter(Recipe.is_vegan == True)
        if user_preferences.get('is_gluten_free'):
            query = query.filter(Recipe.is_gluten_free == True)
        if user_preferences.get('is_paleo'):
            query = query.filter(Recipe.is_paleo == True)
        if user_preferences.get('is_keto'):
            query = query.filter(Recipe.is_keto == True)
        
        # Apply calorie constraints
        if target_calories:
            # For meal planning, each meal should be roughly 1/3 of daily calories
            max_meal_calories = target_calories / 3 * 1.5  # Allow some flexibility
            query = query.filter(Recipe.calories <= max_meal_calories)
        
        # Filter out allergens
        allergies = user_preferences.get('allergies', [])
        if 'nuts' in allergies:
            query = query.filter(Recipe.is_nut_free == True)
        if 'dairy' in allergies:
            query = query.filter(Recipe.is_dairy_free == True)
        
        return query.limit(limit).all() 