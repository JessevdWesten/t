#!/usr/bin/env python3
"""
Data seeder for the Smart Fitness & Nutrition Coach application.
Run this script to populate the database with sample exercises and recipes.
"""

import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Exercise, Recipe, Base
from models.exercise import MuscleGroupEnum, EquipmentEnum, DifficultyEnum, ExerciseTypeEnum
from models.recipe import MealTypeEnum, CuisineEnum, DifficultyEnum as RecipeDifficultyEnum

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

def seed_exercises(db: Session):
    """Seed the database with sample exercises."""
    
    exercises_data = [
        # Bodyweight Exercises
        {
            "name": "Push-ups",
            "description": "Classic upper body exercise targeting chest, shoulders, and triceps",
            "instructions": "Start in plank position, lower chest to ground, push back up",
            "muscle_group": MuscleGroupEnum.CHEST,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.BODYWEIGHT,
            "difficulty_level": DifficultyEnum.BEGINNER,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 8,
            "default_reps_max": 15,
            "default_rest_seconds": 60,
            "calories_per_minute": 7.0
        },
        {
            "name": "Squats",
            "description": "Fundamental lower body exercise for legs and glutes",
            "instructions": "Stand with feet shoulder-width apart, lower down as if sitting, return to standing",
            "muscle_group": MuscleGroupEnum.LEGS,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.BODYWEIGHT,
            "difficulty_level": DifficultyEnum.BEGINNER,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 10,
            "default_reps_max": 20,
            "default_rest_seconds": 60,
            "calories_per_minute": 6.0
        },
        {
            "name": "Plank",
            "description": "Core strengthening exercise for stability and endurance",
            "instructions": "Hold body in straight line from head to heels, engage core",
            "muscle_group": MuscleGroupEnum.CORE,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.BODYWEIGHT,
            "difficulty_level": DifficultyEnum.BEGINNER,
            "is_compound": True,
            "default_sets": 3,
            "default_duration_seconds": 30,
            "default_rest_seconds": 30,
            "calories_per_minute": 4.0
        },
        {
            "name": "Pull-ups",
            "description": "Upper body pulling exercise for back and biceps",
            "instructions": "Hang from bar, pull body up until chin over bar, lower slowly",
            "muscle_group": MuscleGroupEnum.BACK,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.PULL_UP_BAR,
            "difficulty_level": DifficultyEnum.INTERMEDIATE,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 3,
            "default_reps_max": 10,
            "default_rest_seconds": 90,
            "calories_per_minute": 8.0
        },
        
        # Dumbbell Exercises
        {
            "name": "Dumbbell Chest Press",
            "description": "Chest exercise using dumbbells for upper body strength",
            "instructions": "Lie on bench, press dumbbells from chest level to arms extended",
            "muscle_group": MuscleGroupEnum.CHEST,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.DUMBBELLS,
            "difficulty_level": DifficultyEnum.INTERMEDIATE,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 8,
            "default_reps_max": 12,
            "default_rest_seconds": 90,
            "calories_per_minute": 6.0
        },
        {
            "name": "Dumbbell Rows",
            "description": "Back exercise targeting lats and rhomboids",
            "instructions": "Bend over, pull dumbbells to sides of torso, squeeze shoulder blades",
            "muscle_group": MuscleGroupEnum.BACK,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.DUMBBELLS,
            "difficulty_level": DifficultyEnum.INTERMEDIATE,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 8,
            "default_reps_max": 12,
            "default_rest_seconds": 90,
            "calories_per_minute": 6.0
        },
        {
            "name": "Dumbbell Shoulder Press",
            "description": "Overhead pressing movement for shoulder development",
            "instructions": "Press dumbbells from shoulder level to overhead, lower slowly",
            "muscle_group": MuscleGroupEnum.SHOULDERS,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.DUMBBELLS,
            "difficulty_level": DifficultyEnum.INTERMEDIATE,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 8,
            "default_reps_max": 12,
            "default_rest_seconds": 90,
            "calories_per_minute": 5.0
        },
        {
            "name": "Dumbbell Lunges",
            "description": "Unilateral leg exercise for strength and balance",
            "instructions": "Step forward into lunge position, return to start, alternate legs",
            "muscle_group": MuscleGroupEnum.LEGS,
            "exercise_type": ExerciseTypeEnum.STRENGTH,
            "equipment_needed": EquipmentEnum.DUMBBELLS,
            "difficulty_level": DifficultyEnum.INTERMEDIATE,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 8,
            "default_reps_max": 12,
            "default_rest_seconds": 90,
            "calories_per_minute": 7.0
        },
        
        # Cardio Exercises
        {
            "name": "Jumping Jacks",
            "description": "Full-body cardio exercise for warming up and conditioning",
            "instructions": "Jump while spreading legs and raising arms, return to start",
            "muscle_group": MuscleGroupEnum.CARDIO,
            "exercise_type": ExerciseTypeEnum.CARDIO,
            "equipment_needed": EquipmentEnum.BODYWEIGHT,
            "difficulty_level": DifficultyEnum.BEGINNER,
            "is_compound": True,
            "default_sets": 3,
            "default_duration_seconds": 60,
            "default_rest_seconds": 30,
            "calories_per_minute": 10.0
        },
        {
            "name": "Burpees",
            "description": "High-intensity full-body exercise combining squat, plank, and jump",
            "instructions": "Squat down, jump back to plank, jump forward, jump up",
            "muscle_group": MuscleGroupEnum.FULL_BODY,
            "exercise_type": ExerciseTypeEnum.CARDIO,
            "equipment_needed": EquipmentEnum.BODYWEIGHT,
            "difficulty_level": DifficultyEnum.ADVANCED,
            "is_compound": True,
            "default_sets": 3,
            "default_reps_min": 5,
            "default_reps_max": 15,
            "default_rest_seconds": 60,
            "calories_per_minute": 12.0
        }
    ]
    
    for exercise_data in exercises_data:
        # Check if exercise already exists
        existing = db.query(Exercise).filter(Exercise.name == exercise_data["name"]).first()
        if not existing:
            exercise = Exercise(**exercise_data)
            db.add(exercise)
    
    db.commit()
    print(f"✅ Seeded {len(exercises_data)} exercises")

def seed_recipes(db: Session):
    """Seed the database with sample recipes."""
    
    recipes_data = [
        # Breakfast Recipes
        {
            "name": "Protein Pancakes",
            "description": "High-protein pancakes perfect for muscle building",
            "instructions": "Mix eggs, protein powder, and oats. Cook like regular pancakes. Serve with berries.",
            "servings": 2,
            "prep_time_minutes": 10,
            "cook_time_minutes": 10,
            "total_time_minutes": 20,
            "meal_type": MealTypeEnum.BREAKFAST,
            "calories": 320,
            "protein_g": 28,
            "carbs_g": 35,
            "fat_g": 8,
            "fiber_g": 6,
            "ingredients": json.dumps([
                {"name": "eggs", "amount": "2 large"},
                {"name": "protein powder", "amount": "1 scoop"},
                {"name": "rolled oats", "amount": "1/2 cup"},
                {"name": "banana", "amount": "1 medium"},
                {"name": "berries", "amount": "1/2 cup"}
            ]),
            "is_high_protein": True,
            "is_gluten_free": True,
            "difficulty": RecipeDifficultyEnum.EASY
        },
        {
            "name": "Overnight Oats",
            "description": "Easy make-ahead breakfast loaded with fiber",
            "instructions": "Mix oats, milk, chia seeds, and sweetener. Refrigerate overnight. Add toppings before serving.",
            "servings": 1,
            "prep_time_minutes": 5,
            "cook_time_minutes": 0,
            "total_time_minutes": 5,
            "meal_type": MealTypeEnum.BREAKFAST,
            "calories": 280,
            "protein_g": 12,
            "carbs_g": 45,
            "fat_g": 8,
            "fiber_g": 10,
            "ingredients": json.dumps([
                {"name": "rolled oats", "amount": "1/2 cup"},
                {"name": "almond milk", "amount": "1/2 cup"},
                {"name": "chia seeds", "amount": "1 tbsp"},
                {"name": "honey", "amount": "1 tsp"},
                {"name": "mixed berries", "amount": "1/3 cup"}
            ]),
            "is_vegetarian": True,
            "is_meal_prep_friendly": True,
            "difficulty": RecipeDifficultyEnum.EASY
        },
        
        # Lunch Recipes
        {
            "name": "Grilled Chicken Salad",
            "description": "Lean protein salad with mixed greens and vegetables",
            "instructions": "Grill chicken breast, season with herbs. Serve over mixed greens with vegetables and light dressing.",
            "servings": 1,
            "prep_time_minutes": 15,
            "cook_time_minutes": 10,
            "total_time_minutes": 25,
            "meal_type": MealTypeEnum.LUNCH,
            "calories": 350,
            "protein_g": 35,
            "carbs_g": 15,
            "fat_g": 18,
            "fiber_g": 8,
            "ingredients": json.dumps([
                {"name": "chicken breast", "amount": "4 oz"},
                {"name": "mixed greens", "amount": "2 cups"},
                {"name": "cherry tomatoes", "amount": "1/2 cup"},
                {"name": "cucumber", "amount": "1/2 cup"},
                {"name": "olive oil", "amount": "1 tbsp"},
                {"name": "lemon juice", "amount": "1 tbsp"}
            ]),
            "is_high_protein": True,
            "is_gluten_free": True,
            "is_low_carb": True,
            "difficulty": RecipeDifficultyEnum.EASY
        },
        {
            "name": "Quinoa Buddha Bowl",
            "description": "Nutritious vegetarian bowl with quinoa and roasted vegetables",
            "instructions": "Cook quinoa. Roast vegetables. Arrange in bowl with avocado and tahini dressing.",
            "servings": 2,
            "prep_time_minutes": 20,
            "cook_time_minutes": 30,
            "total_time_minutes": 50,
            "meal_type": MealTypeEnum.LUNCH,
            "calories": 420,
            "protein_g": 16,
            "carbs_g": 55,
            "fat_g": 18,
            "fiber_g": 12,
            "ingredients": json.dumps([
                {"name": "quinoa", "amount": "1 cup"},
                {"name": "sweet potato", "amount": "1 medium"},
                {"name": "broccoli", "amount": "1 cup"},
                {"name": "chickpeas", "amount": "1/2 cup"},
                {"name": "avocado", "amount": "1/2 medium"},
                {"name": "tahini", "amount": "2 tbsp"}
            ]),
            "is_vegetarian": True,
            "is_vegan": True,
            "is_gluten_free": True,
            "is_meal_prep_friendly": True,
            "difficulty": RecipeDifficultyEnum.MEDIUM
        },
        
        # Dinner Recipes
        {
            "name": "Baked Salmon with Vegetables",
            "description": "Heart-healthy salmon with roasted seasonal vegetables",
            "instructions": "Season salmon with herbs. Roast with vegetables at 400°F for 15-20 minutes.",
            "servings": 2,
            "prep_time_minutes": 10,
            "cook_time_minutes": 20,
            "total_time_minutes": 30,
            "meal_type": MealTypeEnum.DINNER,
            "calories": 450,
            "protein_g": 35,
            "carbs_g": 25,
            "fat_g": 25,
            "fiber_g": 8,
            "ingredients": json.dumps([
                {"name": "salmon fillet", "amount": "6 oz"},
                {"name": "asparagus", "amount": "1 bunch"},
                {"name": "bell peppers", "amount": "2 medium"},
                {"name": "olive oil", "amount": "2 tbsp"},
                {"name": "lemon", "amount": "1 medium"},
                {"name": "herbs", "amount": "2 tbsp"}
            ]),
            "is_high_protein": True,
            "is_gluten_free": True,
            "is_paleo": True,
            "difficulty": RecipeDifficultyEnum.EASY
        },
        {
            "name": "Turkey Meatballs with Zucchini Noodles",
            "description": "Lean turkey meatballs served over spiralized zucchini",
            "instructions": "Form and bake turkey meatballs. Spiralize zucchini. Serve with marinara sauce.",
            "servings": 3,
            "prep_time_minutes": 20,
            "cook_time_minutes": 25,
            "total_time_minutes": 45,
            "meal_type": MealTypeEnum.DINNER,
            "calories": 320,
            "protein_g": 28,
            "carbs_g": 12,
            "fat_g": 18,
            "fiber_g": 4,
            "ingredients": json.dumps([
                {"name": "ground turkey", "amount": "1 lb"},
                {"name": "zucchini", "amount": "3 medium"},
                {"name": "marinara sauce", "amount": "1 cup"},
                {"name": "egg", "amount": "1 large"},
                {"name": "breadcrumbs", "amount": "1/4 cup"},
                {"name": "parmesan", "amount": "1/4 cup"}
            ]),
            "is_high_protein": True,
            "is_low_carb": True,
            "difficulty": RecipeDifficultyEnum.MEDIUM
        },
        
        # Snack Recipes
        {
            "name": "Greek Yogurt with Berries",
            "description": "High-protein snack with antioxidant-rich berries",
            "instructions": "Top Greek yogurt with fresh berries and a drizzle of honey.",
            "servings": 1,
            "prep_time_minutes": 2,
            "cook_time_minutes": 0,
            "total_time_minutes": 2,
            "meal_type": MealTypeEnum.SNACK,
            "calories": 150,
            "protein_g": 15,
            "carbs_g": 20,
            "fat_g": 2,
            "fiber_g": 3,
            "ingredients": json.dumps([
                {"name": "Greek yogurt", "amount": "3/4 cup"},
                {"name": "mixed berries", "amount": "1/2 cup"},
                {"name": "honey", "amount": "1 tsp"}
            ]),
            "is_vegetarian": True,
            "is_high_protein": True,
            "is_gluten_free": True,
            "difficulty": RecipeDifficultyEnum.EASY
        }
    ]
    
    for recipe_data in recipes_data:
        # Check if recipe already exists
        existing = db.query(Recipe).filter(Recipe.name == recipe_data["name"]).first()
        if not existing:
            recipe = Recipe(**recipe_data)
            db.add(recipe)
    
    db.commit()
    print(f"✅ Seeded {len(recipes_data)} recipes")

def main():
    """Main seeding function."""
    print("🌱 Starting database seeding...")
    
    db = get_db()
    
    try:
        # Seed exercises
        print("Seeding exercises...")
        seed_exercises(db)
        
        # Seed recipes
        print("Seeding recipes...")
        seed_recipes(db)
        
        print("🎉 Database seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
