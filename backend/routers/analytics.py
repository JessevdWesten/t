from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import statistics
import json

from database import get_db
from auth import get_current_user
from models.user import User

router = APIRouter()

@router.get("/dashboard")
async def get_analytics_dashboard(
    period: str = Query("30d", regex="^(7d|30d|90d|1y|all)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive analytics dashboard with key metrics"""
    
    return {
        "period": period,
        "summary": {
            "workouts_completed": 28,
            "calories_burned": 8450,
            "active_days": 24,
            "avg_workout_duration": 52,  # minutes
            "consistency_score": 85.7,  # percentage
            "improvement_trend": 12.3  # percentage
        },
        "fitness_score": {
            "current": 847,
            "previous_period": 782,
            "change": 65,
            "percentile": 88,  # better than 88% of users
            "factors": {
                "consistency": 92,
                "intensity": 78,
                "progression": 85,
                "recovery": 80
            }
        },
        "quick_stats": [
            {
                "label": "💪 Strength Gain",
                "value": "+15.2%",
                "trend": "up",
                "color": "success"
            },
            {
                "label": "🏃 Cardio Endurance",
                "value": "+8.7%", 
                "trend": "up",
                "color": "success"
            },
            {
                "label": "⚖️ Body Fat",
                "value": "-2.1%",
                "trend": "down",
                "color": "success"
            },
            {
                "label": "🎯 Goal Progress",
                "value": "73%",
                "trend": "up",
                "color": "warning"
            }
        ],
        "recent_achievements": [
            "🏆 Completed 30-day workout streak",
            "💪 Increased deadlift by 20lbs",
            "🥗 Hit macro targets 5 days straight"
        ]
    }

@router.get("/workouts")
async def get_workout_analytics(
    period: str = Query("30d"),
    workout_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed workout analytics and trends"""
    
    return {
        "period": period,
        "workout_type": workout_type,
        "overview": {
            "total_workouts": 28,
            "total_duration": 1456,  # minutes
            "avg_duration": 52,
            "calories_burned": 8450,
            "most_active_day": "Tuesday",
            "preferred_time": "6:00 PM"
        },
        "trends": {
            "duration_trend": [45, 48, 52, 55, 58, 52, 49],  # last 7 sessions
            "intensity_trend": [7.2, 7.5, 8.1, 7.8, 8.4, 8.0, 8.2],
            "volume_trend": [12500, 13200, 14100, 13800, 15200, 14600, 15400],  # total weight
            "consistency": {
                "weekly_frequency": 4.2,
                "target_frequency": 5.0,
                "completion_rate": 84
            }
        },
        "workout_distribution": {
            "strength": 60,  # percentage
            "cardio": 25,
            "flexibility": 10,
            "sports": 5
        },
        "intensity_zones": {
            "low": 15,  # percentage of time
            "moderate": 65,
            "high": 20
        },
        "body_parts_trained": [
            {"name": "Chest", "frequency": 12, "volume": 24500},
            {"name": "Back", "frequency": 14, "volume": 28200},
            {"name": "Legs", "frequency": 16, "volume": 35600},
            {"name": "Shoulders", "frequency": 10, "volume": 18400},
            {"name": "Arms", "frequency": 11, "volume": 21300}
        ],
        "performance_metrics": {
            "strength_index": 847,
            "endurance_index": 723,
            "power_index": 692,
            "recovery_rate": 85
        }
    }

@router.get("/nutrition")
async def get_nutrition_analytics(
    period: str = Query("30d"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive nutrition analytics and macro tracking"""
    
    return {
        "period": period,
        "overview": {
            "avg_daily_calories": 2247,
            "target_calories": 2200,
            "compliance_rate": 87,  # percentage of days within target
            "macro_accuracy": 82,  # how close to macro targets
            "hydration_average": 2.8,  # liters per day
            "meal_frequency": 4.2  # meals per day
        },
        "macro_breakdown": {
            "protein": {
                "avg_grams": 165,
                "target_grams": 170,
                "percentage": 29,
                "target_percentage": 30,
                "compliance": 89
            },
            "carbs": {
                "avg_grams": 220,
                "target_grams": 247,
                "percentage": 39,
                "target_percentage": 45,
                "compliance": 73
            },
            "fat": {
                "avg_grams": 78,
                "target_grams": 73,
                "percentage": 32,
                "target_percentage": 25,
                "compliance": 81
            }
        },
        "trends": {
            "daily_calories": [2180, 2340, 2120, 2280, 2190, 2450, 2200],
            "protein_intake": [158, 172, 163, 169, 177, 159, 171],
            "water_intake": [2.4, 3.1, 2.8, 2.9, 3.2, 2.6, 3.0],
            "meal_timing": {
                "breakfast": "7:30 AM",
                "lunch": "12:15 PM", 
                "dinner": "6:45 PM",
                "snacks": ["10:30 AM", "3:30 PM", "9:00 PM"]
            }
        },
        "nutrition_quality": {
            "micronutrient_score": 78,
            "whole_foods_percentage": 84,
            "processed_foods_percentage": 16,
            "fiber_adequacy": 92,
            "vitamin_adequacy": 87
        },
        "meal_analysis": {
            "most_frequent_foods": [
                {"name": "Chicken Breast", "frequency": 18},
                {"name": "Brown Rice", "frequency": 15},
                {"name": "Broccoli", "frequency": 12},
                {"name": "Sweet Potato", "frequency": 10},
                {"name": "Salmon", "frequency": 8}
            ],
            "nutrient_dense_foods": [
                {"name": "Spinach", "score": 96},
                {"name": "Blueberries", "score": 91},
                {"name": "Avocado", "score": 89}
            ]
        }
    }

@router.get("/body-composition")
async def get_body_composition_analytics(
    period: str = Query("90d"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get body composition tracking and trends"""
    
    return {
        "period": period,
        "current_stats": {
            "weight": 175.2,
            "body_fat_percentage": 12.8,
            "muscle_mass": 152.8,
            "bone_density": 98.2,
            "water_percentage": 61.5,
            "visceral_fat": 4,
            "metabolic_age": 26
        },
        "trends": {
            "weight": [
                {"date": "2024-01-01", "value": 178.5},
                {"date": "2024-01-15", "value": 177.2},
                {"date": "2024-01-30", "value": 176.1},
                {"date": "2024-02-15", "value": 175.8},
                {"date": "2024-03-01", "value": 175.2}
            ],
            "body_fat": [
                {"date": "2024-01-01", "value": 15.2},
                {"date": "2024-01-15", "value": 14.6},
                {"date": "2024-01-30", "value": 14.1},
                {"date": "2024-02-15", "value": 13.4},
                {"date": "2024-03-01", "value": 12.8}
            ],
            "muscle_mass": [
                {"date": "2024-01-01", "value": 148.2},
                {"date": "2024-01-15", "value": 149.8},
                {"date": "2024-01-30", "value": 150.9},
                {"date": "2024-02-15", "value": 151.8},
                {"date": "2024-03-01", "value": 152.8}
            ]
        },
        "analysis": {
            "weight_change": -3.3,  # lbs
            "body_fat_change": -2.4,  # percentage points
            "muscle_gain": 4.6,  # lbs
            "composition_improvement": 8.7,  # overall score improvement
            "goals": {
                "target_weight": 170,
                "target_body_fat": 10,
                "progress": {
                    "weight": 69,  # percentage to goal
                    "body_fat": 83
                }
            }
        },
        "recommendations": [
            "🎯 You're making excellent progress! Keep focusing on strength training",
            "🥗 Consider increasing protein intake to support muscle growth", 
            "💧 Maintain current hydration levels for optimal recovery",
            "😴 Ensure 7-8 hours of sleep for optimal body composition changes"
        ]
    }

@router.get("/strength")
async def get_strength_analytics(
    period: str = Query("90d"),
    exercise_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get strength training analytics and progression tracking"""
    
    return {
        "period": period,
        "exercise_type": exercise_type,
        "strength_summary": {
            "total_volume": 485600,  # total weight lifted in lbs
            "avg_weekly_volume": 53955,
            "volume_increase": 18.7,  # percentage
            "strength_score": 847,
            "percentile_rank": 78
        },
        "main_lifts": {
            "squat": {
                "current_max": 315,
                "starting_max": 275,
                "increase": 40,
                "percentage_gain": 14.5,
                "bodyweight_ratio": 1.8,
                "recent_trend": "increasing"
            },
            "bench_press": {
                "current_max": 245,
                "starting_max": 215,
                "increase": 30,
                "percentage_gain": 14.0,
                "bodyweight_ratio": 1.4,
                "recent_trend": "stable"
            },
            "deadlift": {
                "current_max": 405,
                "starting_max": 335,
                "increase": 70,
                "percentage_gain": 20.9,
                "bodyweight_ratio": 2.3,
                "recent_trend": "increasing"
            },
            "overhead_press": {
                "current_max": 155,
                "starting_max": 135,
                "increase": 20,
                "percentage_gain": 14.8,
                "bodyweight_ratio": 0.9,
                "recent_trend": "slow_increase"
            }
        },
        "volume_progression": [
            {"week": "2024-W01", "volume": 42500},
            {"week": "2024-W02", "volume": 45200},
            {"week": "2024-W03", "volume": 48100},
            {"week": "2024-W04", "volume": 46800},
            {"week": "2024-W05", "volume": 51200},
            {"week": "2024-W06", "volume": 53600},
            {"week": "2024-W07", "volume": 55400}
        ],
        "strength_imbalances": [
            {
                "issue": "Left-Right Asymmetry",
                "severity": "mild",
                "affected_exercises": ["Single-leg press", "Dumbbell rows"],
                "recommendation": "Focus on unilateral training"
            }
        ],
        "performance_predictions": {
            "squat_1rm": {
                "predicted_max": 335,
                "confidence": 87,
                "timeframe": "4-6 weeks"
            },
            "bench_1rm": {
                "predicted_max": 260,
                "confidence": 82,
                "timeframe": "6-8 weeks"
            }
        }
    }

@router.get("/progress-photos")
async def get_progress_photos_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress photos timeline and analysis"""
    
    return {
        "photo_timeline": [
            {
                "date": "2024-01-01",
                "photos": {
                    "front": "/photos/front_01_01.jpg",
                    "side": "/photos/side_01_01.jpg",
                    "back": "/photos/back_01_01.jpg"
                },
                "measurements": {
                    "weight": 178.5,
                    "body_fat": 15.2,
                    "chest": 42.0,
                    "waist": 34.5,
                    "arms": 15.8,
                    "thighs": 24.2
                },
                "notes": "Starting transformation journey"
            },
            {
                "date": "2024-02-01", 
                "photos": {
                    "front": "/photos/front_02_01.jpg",
                    "side": "/photos/side_02_01.jpg",
                    "back": "/photos/back_02_01.jpg"
                },
                "measurements": {
                    "weight": 176.1,
                    "body_fat": 14.1,
                    "chest": 42.5,
                    "waist": 33.8,
                    "arms": 16.1,
                    "thighs": 24.6
                },
                "notes": "Great progress in first month!"
            }
        ],
        "visual_changes": {
            "most_improved_areas": ["Arms", "Core definition", "Overall muscle definition"],
            "measurement_changes": {
                "muscle_gained_inches": 1.2,
                "fat_lost_inches": 2.3,
                "total_transformation_score": 8.4
            }
        },
        "next_photo_reminder": {
            "due_date": "2024-03-15",
            "days_remaining": 12,
            "tips": [
                "📸 Take photos in consistent lighting",
                "🕐 Same time of day (morning preferred)",
                "👕 Wear similar clothing for comparison",
                "📏 Take measurements before photos"
            ]
        }
    }

@router.get("/recovery")
async def get_recovery_analytics(
    period: str = Query("30d"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recovery metrics and sleep analysis"""
    
    return {
        "period": period,
        "recovery_overview": {
            "avg_recovery_score": 76,
            "sleep_quality": 78,
            "hrv_trend": "stable",
            "stress_level": "moderate",
            "readiness_score": 82
        },
        "sleep_metrics": {
            "avg_sleep_duration": 7.3,  # hours
            "avg_sleep_efficiency": 87,  # percentage
            "avg_deep_sleep": 1.8,  # hours
            "avg_rem_sleep": 1.4,  # hours
            "sleep_consistency": 73,  # score
            "bedtime_consistency": "11:15 PM ± 45min"
        },
        "recovery_trends": {
            "daily_scores": [74, 78, 82, 69, 75, 81, 77],
            "weekly_average": [76, 79, 73, 78],
            "factors_affecting_recovery": [
                {"factor": "Workout intensity", "impact": -5},
                {"factor": "Sleep quality", "impact": +8},
                {"factor": "Nutrition timing", "impact": +3},
                {"factor": "Stress levels", "impact": -4}
            ]
        },
        "recommendations": {
            "immediate": [
                "💤 Aim for 8 hours of sleep tonight",
                "🧘 Consider 10 minutes of meditation before bed",
                "📱 Reduce screen time 1 hour before sleep"
            ],
            "weekly": [
                "🛁 Schedule 2 recovery/rest days",
                "🧖‍♂️ Add yoga or stretching sessions",
                "💆‍♂️ Consider massage or foam rolling"
            ]
        },
        "recovery_plan": {
            "active_recovery_days": ["Wednesday", "Sunday"],
            "suggested_activities": [
                "Light walking",
                "Gentle yoga",
                "Swimming", 
                "Foam rolling"
            ]
        }
    }

@router.get("/goals")
async def get_goals_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get goal tracking and achievement analytics"""
    
    return {
        "active_goals": [
            {
                "id": "lose_weight",
                "title": "Lose 10 lbs",
                "target_value": 10,
                "current_progress": 6.3,
                "percentage": 63,
                "target_date": "2024-06-01",
                "days_remaining": 87,
                "on_track": True,
                "weekly_target": 0.5,
                "weekly_actual": 0.6
            },
            {
                "id": "bench_press",
                "title": "Bench Press 250 lbs",
                "target_value": 250,
                "current_progress": 245,
                "percentage": 98,
                "target_date": "2024-04-01",
                "days_remaining": 25,
                "on_track": True,
                "weekly_target": 2.5,
                "weekly_actual": 2.1
            }
        ],
        "completed_goals": [
            {
                "id": "first_5k",
                "title": "Run first 5K",
                "completed_date": "2024-01-15",
                "time_to_complete": 45,  # days
                "celebration_earned": "🏃‍♂️ First 5K Finisher Badge"
            }
        ],
        "goal_insights": {
            "completion_rate": 73,  # percentage of goals completed on time
            "avg_time_to_complete": 52,  # days
            "most_successful_goal_type": "Strength goals",
            "area_for_improvement": "Consistency goals"
        },
        "suggested_goals": [
            {
                "title": "Increase flexibility",
                "description": "Touch your toes without bending knees",
                "difficulty": "Moderate",
                "estimated_time": "6-8 weeks"
            },
            {
                "title": "Deadlift 2x bodyweight", 
                "description": "Achieve 350 lb deadlift",
                "difficulty": "Challenging",
                "estimated_time": "3-4 months"
            }
        ]
    }

@router.get("/export")
async def export_analytics_data(
    format: str = Query("json", regex="^(json|csv|pdf)$"),
    period: str = Query("90d"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export user's analytics data in various formats"""
    
    return {
        "export_info": {
            "format": format,
            "period": period,
            "generated_date": datetime.now().isoformat(),
            "user_id": current_user.id
        },
        "download_url": f"/downloads/analytics_export_{current_user.id}_{datetime.now().strftime('%Y%m%d')}.{format}",
        "file_size": "2.4 MB",
        "expiry_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "included_data": [
            "Workout history and analytics",
            "Nutrition tracking and trends",
            "Body composition measurements",
            "Goal progress and achievements",
            "Recovery and sleep metrics"
        ]
    } 