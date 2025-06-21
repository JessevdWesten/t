from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json

from database import get_db
from auth import get_current_user
from models.user import User

router = APIRouter()

# Achievement Types and Definitions
ACHIEVEMENT_DEFINITIONS = {
    "workout_streaks": {
        "first_workout": {
            "name": "🏃 First Steps",
            "description": "Complete your first workout",
            "icon": "🏃‍♂️",
            "points": 50,
            "criteria": {"workouts_completed": 1}
        },
        "week_warrior": {
            "name": "💪 Week Warrior", 
            "description": "Complete workouts for 7 consecutive days",
            "icon": "💪",
            "points": 200,
            "criteria": {"workout_streak": 7}
        },
        "month_master": {
            "name": "🔥 Month Master",
            "description": "Complete workouts for 30 consecutive days", 
            "icon": "🔥",
            "points": 1000,
            "criteria": {"workout_streak": 30}
        },
        "century_club": {
            "name": "💯 Century Club",
            "description": "Complete 100 total workouts",
            "icon": "💯", 
            "points": 2000,
            "criteria": {"total_workouts": 100}
        }
    },
    "nutrition_goals": {
        "macro_master": {
            "name": "🎯 Macro Master",
            "description": "Hit your macro targets for 7 consecutive days",
            "icon": "🎯",
            "points": 300,
            "criteria": {"macro_streak": 7}
        },
        "hydration_hero": {
            "name": "💧 Hydration Hero", 
            "description": "Meet daily water goals for 14 days",
            "icon": "💧",
            "points": 250,
            "criteria": {"hydration_streak": 14}
        },
        "calorie_champion": {
            "name": "🔥 Calorie Champion",
            "description": "Stay within calorie goals for 30 days",
            "icon": "🔥",
            "points": 500,
            "criteria": {"calorie_streak": 30}
        }
    },
    "strength_milestones": {
        "iron_beginner": {
            "name": "🦾 Iron Beginner",
            "description": "Increase any lift by 10%",
            "icon": "🦾",
            "points": 150,
            "criteria": {"strength_increase_percent": 10}
        },
        "strength_surge": {
            "name": "⚡ Strength Surge", 
            "description": "Increase total weight lifted by 1000lbs",
            "icon": "⚡",
            "points": 400,
            "criteria": {"total_weight_increase": 1000}
        },
        "powerlifter": {
            "name": "🏋️ Powerlifter",
            "description": "Achieve 2x bodyweight deadlift",
            "icon": "🏋️‍♂️",
            "points": 800,
            "criteria": {"deadlift_bodyweight_ratio": 2.0}
        }
    },
    "social_achievements": {
        "motivator": {
            "name": "👏 Motivator",
            "description": "Encourage 50 friends' workouts",
            "icon": "👏",
            "points": 300,
            "criteria": {"encouragements_given": 50}
        },
        "community_champion": {
            "name": "🌟 Community Champion",
            "description": "Complete 10 group challenges",
            "icon": "🌟", 
            "points": 600,
            "criteria": {"group_challenges": 10}
        },
        "social_butterfly": {
            "name": "🦋 Social Butterfly",
            "description": "Connect with 25 fitness friends",
            "icon": "🦋",
            "points": 200,
            "criteria": {"friends_count": 25}
        }
    },
    "consistency_rewards": {
        "early_bird": {
            "name": "🌅 Early Bird",
            "description": "Complete 20 morning workouts (before 8AM)",
            "icon": "🌅",
            "points": 350,
            "criteria": {"morning_workouts": 20}
        },
        "weekend_warrior": {
            "name": "⚡ Weekend Warrior", 
            "description": "Never miss a weekend workout for 8 weeks",
            "icon": "⚡",
            "points": 400,
            "criteria": {"weekend_streak": 8}
        },
        "consistency_king": {
            "name": "👑 Consistency King",
            "description": "Maintain 90% workout completion for 6 months",
            "icon": "👑",
            "points": 1500,
            "criteria": {"completion_rate": 90, "duration_months": 6}
        }
    }
}

@router.get("/", response_model=List[dict])
async def get_user_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all achievements for the current user with progress tracking"""
    
    # Get user's achievement progress (you'd implement this based on your tracking)
    user_stats = await get_user_fitness_stats(current_user.id, db)
    
    achievements = []
    
    for category, category_achievements in ACHIEVEMENT_DEFINITIONS.items():
        for achievement_id, achievement in category_achievements.items():
            
            # Check if user has earned this achievement
            earned = check_achievement_criteria(achievement["criteria"], user_stats)
            progress = calculate_achievement_progress(achievement["criteria"], user_stats)
            
            achievements.append({
                "id": achievement_id,
                "category": category,
                "name": achievement["name"],
                "description": achievement["description"],
                "icon": achievement["icon"],
                "points": achievement["points"],
                "earned": earned,
                "progress": progress,
                "earned_date": user_stats.get(f"{achievement_id}_earned_date") if earned else None
            })
    
    return achievements

@router.get("/earned")
async def get_earned_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get only the achievements the user has earned"""
    
    all_achievements = await get_user_achievements(current_user, db)
    earned_achievements = [a for a in all_achievements if a["earned"]]
    
    total_points = sum(a["points"] for a in earned_achievements)
    
    return {
        "earned_achievements": earned_achievements,
        "total_count": len(earned_achievements),
        "total_points": total_points,
        "user_level": calculate_user_level(total_points)
    }

@router.get("/leaderboard")
async def get_achievement_leaderboard(
    period: str = Query("all_time", regex="^(weekly|monthly|all_time)$"),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    """Get achievement leaderboard for different time periods"""
    
    # This would be implemented with actual database queries
    # For now, returning mock data structure
    
    return {
        "period": period,
        "leaderboard": [
            {
                "rank": 1,
                "user_id": "user123",
                "username": "FitnessGuru2024", 
                "total_points": 5420,
                "achievements_count": 23,
                "level": 8,
                "avatar": "🏆"
            },
            {
                "rank": 2,
                "user_id": "user456", 
                "username": "IronLifter",
                "total_points": 4890,
                "achievements_count": 21,
                "level": 7,
                "avatar": "💪"
            },
            {
                "rank": 3,
                "user_id": "user789",
                "username": "CardioQueen",
                "total_points": 4200,
                "achievements_count": 19,
                "level": 7,
                "avatar": "🏃‍♀️"
            }
        ],
        "user_rank": 15,
        "total_participants": 1247
    }

@router.get("/challenges")
async def get_active_challenges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get active community challenges"""
    
    return {
        "active_challenges": [
            {
                "id": "summer_shred_2024",
                "name": "🔥 Summer Shred Challenge",
                "description": "Complete 100 workouts in 90 days",
                "start_date": "2024-06-01",
                "end_date": "2024-08-30",
                "participants": 2847,
                "user_progress": {
                    "completed": 34,
                    "target": 100,
                    "rank": 156
                },
                "rewards": {
                    "points": 2000,
                    "badge": "🏆 Summer Shred Champion",
                    "exclusive_content": True
                }
            },
            {
                "id": "plant_power_month",
                "name": "🌱 Plant Power Month", 
                "description": "Eat 5 servings of vegetables daily for 30 days",
                "start_date": "2024-07-01",
                "end_date": "2024-07-31", 
                "participants": 1543,
                "user_progress": {
                    "completed": 12,
                    "target": 30,
                    "rank": 89
                },
                "rewards": {
                    "points": 750,
                    "badge": "🥬 Veggie Master",
                    "recipe_unlock": True
                }
            }
        ],
        "upcoming_challenges": [
            {
                "id": "strength_september", 
                "name": "💪 Strength September",
                "description": "Increase your max lifts by 10%",
                "start_date": "2024-09-01",
                "estimated_participants": 3200,
                "early_bird_bonus": 100
            }
        ]
    }

@router.post("/challenges/{challenge_id}/join")
async def join_challenge(
    challenge_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Join a community challenge"""
    
    # Implementation would add user to challenge participants
    
    return {
        "message": f"Successfully joined challenge: {challenge_id}",
        "challenge_id": challenge_id,
        "user_id": current_user.id,
        "joined_date": datetime.now().isoformat(),
        "bonus_points": 50  # Joining bonus
    }

@router.get("/streaks")
async def get_user_streaks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current streaks and streak history"""
    
    return {
        "current_streaks": {
            "workout_streak": {
                "current": 12,
                "longest": 28,
                "last_workout": "2024-01-15",
                "streak_active": True
            },
            "nutrition_streak": {
                "current": 8,
                "longest": 15,
                "last_logged": "2024-01-15",
                "streak_active": True
            },
            "hydration_streak": {
                "current": 5,
                "longest": 22,
                "last_logged": "2024-01-15", 
                "streak_active": True
            }
        },
        "streak_rewards": {
            "next_workout_milestone": {
                "target": 14,
                "reward_points": 100,
                "days_remaining": 2
            },
            "next_nutrition_milestone": {
                "target": 10,
                "reward_points": 75,
                "days_remaining": 2
            }
        },
        "streak_tips": [
            "🎯 Keep up the great work! You're only 2 days away from your next workout milestone",
            "💧 Remember to log your water intake to maintain your hydration streak",
            "🥗 Plan tomorrow's meals to keep your nutrition streak going"
        ]
    }

@router.get("/badges")
async def get_user_badges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's earned badges and badge showcase"""
    
    return {
        "earned_badges": [
            {
                "id": "first_workout",
                "name": "🏃 First Steps",
                "earned_date": "2024-01-01",
                "rarity": "common"
            },
            {
                "id": "week_warrior", 
                "name": "💪 Week Warrior",
                "earned_date": "2024-01-08",
                "rarity": "uncommon"
            },
            {
                "id": "macro_master",
                "name": "🎯 Macro Master", 
                "earned_date": "2024-01-12",
                "rarity": "rare"
            }
        ],
        "showcase_badges": [  # User's selected badges to display
            "week_warrior",
            "macro_master", 
            "hydration_hero"
        ],
        "badge_stats": {
            "total_earned": 15,
            "common": 8,
            "uncommon": 5,
            "rare": 2,
            "legendary": 0
        },
        "next_badges": [
            {
                "id": "month_master",
                "name": "🔥 Month Master",
                "progress": 40,  # 12/30 days
                "estimated_days": 18
            }
        ]
    }

@router.put("/badges/showcase")
async def update_badge_showcase(
    showcase_badges: List[str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's badge showcase (max 3 badges)"""
    
    if len(showcase_badges) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 3 badges can be showcased"
        )
    
    # Update user's badge showcase in database
    
    return {
        "message": "Badge showcase updated successfully",
        "showcase_badges": showcase_badges
    }

# Helper functions
async def get_user_fitness_stats(user_id: int, db: Session) -> dict:
    """Get comprehensive user fitness statistics for achievement calculation"""
    
    # This would query your actual database for user statistics
    # For now, returning mock data
    
    return {
        "workouts_completed": 45,
        "workout_streak": 12,
        "total_workouts": 45,
        "macro_streak": 8,
        "hydration_streak": 5,
        "calorie_streak": 15,
        "strength_increase_percent": 15.5,
        "total_weight_increase": 1250,
        "deadlift_bodyweight_ratio": 1.8,
        "encouragements_given": 23,
        "group_challenges": 3,
        "friends_count": 18,
        "morning_workouts": 12,
        "weekend_streak": 4,
        "completion_rate": 88.5
    }

def check_achievement_criteria(criteria: dict, user_stats: dict) -> bool:
    """Check if user meets the criteria for an achievement"""
    
    for key, required_value in criteria.items():
        user_value = user_stats.get(key, 0)
        if user_value < required_value:
            return False
    
    return True

def calculate_achievement_progress(criteria: dict, user_stats: dict) -> dict:
    """Calculate progress towards achievement"""
    
    progress = {}
    
    for key, required_value in criteria.items():
        user_value = user_stats.get(key, 0)
        progress[key] = {
            "current": user_value,
            "target": required_value,
            "percentage": min(100, (user_value / required_value) * 100)
        }
    
    # Overall progress is the minimum percentage across all criteria
    overall_progress = min(p["percentage"] for p in progress.values())
    
    return {
        "overall_percentage": overall_progress,
        "criteria_progress": progress,
        "completed": overall_progress >= 100
    }

def calculate_user_level(total_points: int) -> dict:
    """Calculate user level based on total achievement points"""
    
    # Level thresholds
    levels = [
        (0, "🌱 Beginner"),
        (500, "🏃 Walker"), 
        (1000, "💪 Athlete"),
        (2000, "🔥 Warrior"),
        (3500, "⚡ Champion"),
        (5000, "🏆 Legend"),
        (7500, "👑 Master"),
        (10000, "🌟 Grandmaster")
    ]
    
    current_level = 1
    current_title = "🌱 Beginner"
    next_threshold = 500
    
    for threshold, title in levels:
        if total_points >= threshold:
            current_level += 1
            current_title = title
        else:
            next_threshold = threshold
            break
    
    points_to_next = max(0, next_threshold - total_points)
    
    return {
        "level": current_level,
        "title": current_title,
        "points_to_next_level": points_to_next,
        "progress_to_next": ((total_points - (next_threshold - 500)) / 500) * 100 if current_level > 1 else (total_points / 500) * 100
    } 