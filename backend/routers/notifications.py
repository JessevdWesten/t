from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel
from enum import Enum

from database import get_db
from auth import get_current_user
from models.user import User

router = APIRouter()

class NotificationType(str, Enum):
    WORKOUT_REMINDER = "workout_reminder"
    ACHIEVEMENT_UNLOCKED = "achievement_unlocked"
    FRIEND_REQUEST = "friend_request"
    SOCIAL_ACTIVITY = "social_activity"
    GOAL_PROGRESS = "goal_progress"
    CHALLENGE_UPDATE = "challenge_update"
    MOTIVATIONAL = "motivational"
    SYSTEM = "system"
    STREAK_WARNING = "streak_warning"
    RECOVERY_SUGGESTION = "recovery_suggestion"

class NotificationPreferences(BaseModel):
    workout_reminders: bool = True
    achievement_alerts: bool = True
    social_notifications: bool = True
    goal_updates: bool = True
    challenge_updates: bool = True
    motivational_messages: bool = True
    friend_activity: bool = True
    streak_alerts: bool = True
    recovery_suggestions: bool = True
    email_notifications: bool = False
    push_notifications: bool = True
    quiet_hours_start: str = "22:00"
    quiet_hours_end: str = "07:00"

@router.get("/")
async def get_notifications(
    limit: int = Query(20, le=50),
    offset: int = Query(0),
    unread_only: bool = Query(False),
    notification_type: Optional[NotificationType] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's notifications with filtering options"""
    
    return {
        "notifications": [
            {
                "id": "notif_001",
                "type": NotificationType.ACHIEVEMENT_UNLOCKED,
                "title": "🏆 New Achievement Unlocked!",
                "message": "Congratulations! You've earned the 'Week Warrior' badge for completing 7 consecutive workouts!",
                "timestamp": "2024-01-15T19:30:00Z",
                "read": False,
                "priority": "high",
                "data": {
                    "achievement_id": "week_warrior",
                    "points_earned": 200,
                    "badge_icon": "💪"
                },
                "action": {
                    "type": "view_achievement",
                    "url": "/achievements/week_warrior"
                }
            },
            {
                "id": "notif_002",
                "type": NotificationType.SOCIAL_ACTIVITY,
                "title": "👏 Your friend needs motivation!",
                "message": "FitnessGuru just completed an intense leg workout. Show some support! 💪",
                "timestamp": "2024-01-15T18:45:00Z",
                "read": False,
                "priority": "medium",
                "data": {
                    "friend_id": 456,
                    "friend_username": "FitnessGuru",
                    "post_id": "post_123",
                    "workout_type": "Leg Day"
                },
                "action": {
                    "type": "motivate_friend",
                    "url": "/social/posts/post_123"
                }
            },
            {
                "id": "notif_003",
                "type": NotificationType.WORKOUT_REMINDER,
                "title": "⏰ Time to crush your workout!",
                "message": "Your scheduled Upper Body workout starts in 30 minutes. You've got this! 💪",
                "timestamp": "2024-01-15T17:30:00Z",
                "read": True,
                "priority": "high",
                "data": {
                    "workout_id": "workout_456",
                    "workout_name": "Upper Body Strength",
                    "scheduled_time": "18:00",
                    "estimated_duration": 60
                },
                "action": {
                    "type": "start_workout",
                    "url": "/workouts/workout_456/start"
                }
            },
            {
                "id": "notif_004",
                "type": NotificationType.GOAL_PROGRESS,
                "title": "🎯 Goal Progress Update",
                "message": "Great job! You're 73% of the way to your weight loss goal. Only 2.7 lbs to go!",
                "timestamp": "2024-01-15T16:00:00Z",
                "read": True,
                "priority": "medium",
                "data": {
                    "goal_id": "weight_loss_goal",
                    "progress_percentage": 73,
                    "remaining": "2.7 lbs",
                    "target_date": "2024-03-01"
                },
                "action": {
                    "type": "view_goal",
                    "url": "/goals/weight_loss_goal"
                }
            },
            {
                "id": "notif_005",
                "type": NotificationType.STREAK_WARNING,
                "title": "🔥 Don't break your streak!",
                "message": "You haven't worked out today. Keep your 12-day streak alive with a quick 20-minute session!",
                "timestamp": "2024-01-15T20:00:00Z",
                "read": False,
                "priority": "high",
                "data": {
                    "current_streak": 12,
                    "streak_type": "workout",
                    "hours_remaining": 4,
                    "quick_workouts": ["20-min HIIT", "15-min Core", "25-min Yoga"]
                },
                "action": {
                    "type": "quick_workout",
                    "url": "/workouts/quick"
                }
            },
            {
                "id": "notif_006",
                "type": NotificationType.CHALLENGE_UPDATE,
                "title": "🏆 Challenge Leaderboard Update",
                "message": "You moved up to 8th place in the Summer Shred Challenge! Keep pushing! 🔥",
                "timestamp": "2024-01-15T14:30:00Z",
                "read": True,
                "priority": "medium",
                "data": {
                    "challenge_id": "summer_shred_2024",
                    "new_rank": 8,
                    "previous_rank": 12,
                    "participants": 2847,
                    "points_to_next_rank": 450
                },
                "action": {
                    "type": "view_challenge",
                    "url": "/challenges/summer_shred_2024"
                }
            },
            {
                "id": "notif_007",
                "type": NotificationType.MOTIVATIONAL,
                "title": "💪 You're stronger than you think!",
                "message": "Remember: Every pro was once a beginner. Every expert was once a disaster. Keep going! 🌟",
                "timestamp": "2024-01-15T12:00:00Z",
                "read": True,
                "priority": "low",
                "data": {
                    "quote_category": "perseverance",
                    "personalized": True
                },
                "action": {
                    "type": "share_motivation",
                    "url": "/social/share-quote"
                }
            },
            {
                "id": "notif_008",
                "type": NotificationType.RECOVERY_SUGGESTION,
                "title": "😴 Recovery Reminder",
                "message": "Your recovery score is low (65%). Consider taking a rest day or doing light stretching today.",
                "timestamp": "2024-01-15T08:00:00Z",
                "read": False,
                "priority": "medium",
                "data": {
                    "recovery_score": 65,
                    "suggested_activities": ["Gentle yoga", "Walking", "Foam rolling"],
                    "sleep_quality": "Poor",
                    "stress_level": "High"
                },
                "action": {
                    "type": "view_recovery",
                    "url": "/analytics/recovery"
                }
            }
        ],
        "summary": {
            "total_notifications": 42,
            "unread_count": 5,
            "high_priority": 3,
            "today_count": 8
        },
        "pagination": {
            "limit": limit,
            "offset": offset,
            "has_more": True
        }
    }

@router.post("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a specific notification as read"""
    
    return {
        "message": "Notification marked as read",
        "notification_id": notification_id,
        "read_at": datetime.now().isoformat()
    }

@router.post("/mark-all-read")
async def mark_all_notifications_read(
    notification_type: Optional[NotificationType] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications or all of a specific type as read"""
    
    return {
        "message": f"All {notification_type or 'notifications'} marked as read",
        "marked_count": 5,
        "timestamp": datetime.now().isoformat()
    }

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific notification"""
    
    return {
        "message": "Notification deleted successfully",
        "notification_id": notification_id
    }

@router.get("/preferences")
async def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's notification preferences"""
    
    return {
        "preferences": {
            "workout_reminders": True,
            "achievement_alerts": True,
            "social_notifications": True,
            "goal_updates": True,
            "challenge_updates": True,
            "motivational_messages": True,
            "friend_activity": True,
            "streak_alerts": True,
            "recovery_suggestions": True,
            "email_notifications": False,
            "push_notifications": True,
            "quiet_hours_start": "22:00",
            "quiet_hours_end": "07:00"
        },
        "notification_types": [
            {
                "type": "workout_reminders",
                "name": "🏋️ Workout Reminders",
                "description": "Get notified about scheduled workouts and rest day reminders",
                "frequency": "Daily as scheduled"
            },
            {
                "type": "achievement_alerts", 
                "name": "🏆 Achievement Alerts",
                "description": "Celebrate your victories with achievement unlock notifications",
                "frequency": "When earned"
            },
            {
                "type": "social_notifications",
                "name": "👥 Social Activity",
                "description": "Stay connected with friend activities, likes, and comments",
                "frequency": "Real-time"
            },
            {
                "type": "goal_updates",
                "name": "🎯 Goal Progress",
                "description": "Track your progress towards fitness and nutrition goals",
                "frequency": "Weekly summaries"
            },
            {
                "type": "challenge_updates",
                "name": "🏆 Challenge Updates",
                "description": "Stay informed about challenge progress and leaderboard changes",
                "frequency": "Daily during challenges"
            },
            {
                "type": "motivational_messages",
                "name": "💪 Motivational Messages",
                "description": "Receive personalized motivational quotes and tips",
                "frequency": "2-3 times per week"
            },
            {
                "type": "streak_alerts",
                "name": "🔥 Streak Alerts",
                "description": "Don't break your streak! Get reminders to maintain consistency",
                "frequency": "When at risk"
            },
            {
                "type": "recovery_suggestions",
                "name": "😴 Recovery Suggestions",
                "description": "Smart recommendations based on your recovery metrics",
                "frequency": "As needed"
            }
        ]
    }

@router.put("/preferences")
async def update_notification_preferences(
    preferences: NotificationPreferences,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's notification preferences"""
    
    return {
        "message": "Notification preferences updated successfully",
        "preferences": preferences.dict(),
        "updated_at": datetime.now().isoformat()
    }

@router.get("/schedule")
async def get_notification_schedule(
    days_ahead: int = Query(7, le=30),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get upcoming scheduled notifications"""
    
    return {
        "upcoming_notifications": [
            {
                "type": NotificationType.WORKOUT_REMINDER,
                "scheduled_time": "2024-01-16T17:30:00Z",
                "title": "Upper Body Workout Reminder",
                "workout": "Push Day - Chest & Triceps",
                "can_reschedule": True
            },
            {
                "type": NotificationType.GOAL_PROGRESS,
                "scheduled_time": "2024-01-17T09:00:00Z", 
                "title": "Weekly Goal Check-in",
                "goals": ["Weight Loss", "Strength Gain"],
                "can_reschedule": False
            },
            {
                "type": NotificationType.MOTIVATIONAL,
                "scheduled_time": "2024-01-17T07:00:00Z",
                "title": "Morning Motivation",
                "message": "Personalized motivational message",
                "can_reschedule": True
            },
            {
                "type": NotificationType.RECOVERY_SUGGESTION,
                "scheduled_time": "2024-01-18T08:00:00Z",
                "title": "Recovery Check",
                "based_on": "Sleep and workout data",
                "can_reschedule": False
            }
        ],
        "schedule_summary": {
            "total_scheduled": 15,
            "workout_reminders": 8,
            "goal_updates": 3,
            "motivational": 4
        },
        "optimization_tips": [
            "🌅 Your most active notification time is 7-9 AM",
            "📱 Consider enabling quiet hours from 10 PM - 6 AM",
            "⚡ Enable push notifications for time-sensitive alerts"
        ]
    }

@router.post("/test")
async def send_test_notification(
    notification_type: NotificationType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a test notification to preview how it will look"""
    
    test_notifications = {
        NotificationType.WORKOUT_REMINDER: {
            "title": "🏋️ Test Workout Reminder",
            "message": "This is how your workout reminders will look. Time to get moving! 💪"
        },
        NotificationType.ACHIEVEMENT_UNLOCKED: {
            "title": "🏆 Test Achievement",
            "message": "Congratulations! This is how achievement notifications will appear when you unlock new badges!"
        },
        NotificationType.MOTIVATIONAL: {
            "title": "💪 Test Motivation",
            "message": "You're capable of amazing things! This is a sample motivational message."
        },
        NotificationType.STREAK_WARNING: {
            "title": "🔥 Test Streak Alert",
            "message": "Don't break your streak! This is how streak warnings will appear."
        }
    }
    
    test_notification = test_notifications.get(notification_type, {
        "title": "🔔 Test Notification",
        "message": "This is a test notification of the selected type."
    })
    
    return {
        "message": "Test notification sent!",
        "notification": {
            "id": f"test_{notification_type.value}",
            "type": notification_type,
            **test_notification,
            "timestamp": datetime.now().isoformat(),
            "is_test": True
        }
    }

@router.get("/analytics")
async def get_notification_analytics(
    period: str = Query("30d", regex="^(7d|30d|90d)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics about notification engagement and effectiveness"""
    
    return {
        "period": period,
        "overview": {
            "total_sent": 342,
            "total_opened": 289,
            "open_rate": 84.5,  # percentage
            "action_taken": 156,
            "action_rate": 54.0,  # percentage of opened notifications that led to action
            "most_effective_type": "workout_reminders",
            "least_effective_type": "motivational"
        },
        "engagement_by_type": [
            {
                "type": "workout_reminders",
                "sent": 89,
                "opened": 81,
                "open_rate": 91.0,
                "actions": 67,
                "action_rate": 82.7,
                "effectiveness": "Very High"
            },
            {
                "type": "achievement_alerts",
                "sent": 23,
                "opened": 23,
                "open_rate": 100.0,
                "actions": 18,
                "action_rate": 78.3,
                "effectiveness": "High"
            },
            {
                "type": "social_notifications",
                "sent": 67,
                "opened": 54,
                "open_rate": 80.6,
                "actions": 32,
                "action_rate": 59.3,
                "effectiveness": "Medium"
            },
            {
                "type": "streak_alerts",
                "sent": 12,
                "opened": 12,
                "open_rate": 100.0,
                "actions": 10,
                "action_rate": 83.3,
                "effectiveness": "Very High"
            }
        ],
        "timing_analysis": {
            "best_send_times": [
                {"time": "07:00", "open_rate": 92.3},
                {"time": "17:30", "open_rate": 87.1},
                {"time": "12:00", "open_rate": 74.2}
            ],
            "worst_send_times": [
                {"time": "23:00", "open_rate": 23.4},
                {"time": "14:00", "open_rate": 45.6}
            ]
        },
        "recommendations": [
            "🎯 Workout reminders are your most effective notifications - consider increasing frequency",
            "⏰ Send notifications between 7-9 AM for best engagement",
            "🔥 Streak alerts have 100% open rate - use them strategically",
            "📱 Consider reducing motivational messages frequency to improve overall engagement"
        ]
    }

@router.get("/smart-suggestions")
async def get_smart_notification_suggestions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-powered suggestions for notification timing and content"""
    
    return {
        "personalized_suggestions": {
            "optimal_workout_reminder_time": "17:30",
            "reasoning": "Based on your workout history, you're most likely to exercise at 6 PM",
            "confidence": 87
        },
        "content_optimization": [
            {
                "notification_type": "workout_reminders",
                "current_effectiveness": 91,
                "suggestion": "Add specific exercise mentions for higher engagement",
                "example": "Time for your Deadlift and Squat session! 🏋️‍♂️"
            },
            {
                "notification_type": "motivational",
                "current_effectiveness": 43,
                "suggestion": "Personalize with recent achievements",
                "example": "You crushed that PR yesterday! Keep the momentum going! 💪"
            }
        ],
        "frequency_recommendations": {
            "workout_reminders": {
                "current": "daily",
                "suggested": "daily",
                "reason": "High engagement - maintain current frequency"
            },
            "motivational": {
                "current": "daily",
                "suggested": "3x per week",
                "reason": "Reduce frequency to increase impact"
            },
            "social_notifications": {
                "current": "real-time",
                "suggested": "batch 2x daily",
                "reason": "Reduce notification overload while maintaining social connection"
            }
        },
        "smart_features": [
            {
                "feature": "Workout Weather Integration",
                "description": "Adjust outdoor workout reminders based on weather",
                "impact": "15% higher engagement for outdoor activities"
            },
            {
                "feature": "Recovery-Based Scheduling",
                "description": "Delay intense workout reminders when recovery score is low",
                "impact": "Reduce injury risk and improve workout quality"
            },
            {
                "feature": "Social Context Awareness",
                "description": "Time social notifications when friends are most active",
                "impact": "23% higher social engagement"
            }
        ]
    } 