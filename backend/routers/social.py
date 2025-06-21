from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from database import get_db
from auth import get_current_user
from models.user import User

router = APIRouter()

# Pydantic models for social features
class WorkoutPost(BaseModel):
    workout_type: str
    duration_minutes: int
    calories_burned: Optional[int] = None
    notes: Optional[str] = None
    photo_url: Optional[str] = None
    visibility: str = "friends"  # public, friends, private

class Comment(BaseModel):
    content: str
    parent_comment_id: Optional[int] = None

class ChallengeInvite(BaseModel):
    challenge_id: str
    friend_ids: List[int]
    custom_message: Optional[str] = None

@router.get("/feed")
async def get_social_feed(
    limit: int = Query(20, le=50),
    offset: int = Query(0),
    filter_type: str = Query("all", regex="^(all|friends|following|popular)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized social feed with workouts, achievements, and activities"""
    
    return {
        "feed": [
            {
                "id": "post_123",
                "type": "workout_completion",
                "user": {
                    "id": 456,
                    "username": "FitnessGuru",
                    "avatar": "🏋️‍♂️",
                    "level": 7,
                    "is_friend": True
                },
                "timestamp": "2024-01-15T18:30:00Z",
                "content": {
                    "workout_type": "Upper Body Strength",
                    "duration": 65,
                    "calories": 420,
                    "exercises_completed": 8,
                    "personal_record": True,
                    "notes": "Crushed that PR on bench press! 💪",
                    "photos": ["/uploads/workout_photo_123.jpg"]
                },
                "engagement": {
                    "likes": 15,
                    "comments": 3,
                    "motivations": 7,
                    "user_liked": False,
                    "user_motivated": True
                },
                "achievements_unlocked": [
                    "🏆 New Personal Record",
                    "💪 Strength Warrior"
                ]
            },
            {
                "id": "post_124",
                "type": "achievement_unlocked",
                "user": {
                    "id": 789,
                    "username": "RunnerGirl",
                    "avatar": "🏃‍♀️",
                    "level": 5,
                    "is_friend": True
                },
                "timestamp": "2024-01-15T16:45:00Z",
                "content": {
                    "achievement": {
                        "name": "🔥 30-Day Streak",
                        "description": "Completed workouts for 30 consecutive days",
                        "icon": "🔥",
                        "points": 1000
                    },
                    "celebration_message": "Can't believe I kept going for a whole month! 🎉"
                },
                "engagement": {
                    "likes": 32,
                    "comments": 8,
                    "motivations": 18,
                    "user_liked": True,
                    "user_motivated": True
                }
            },
            {
                "id": "post_125",
                "type": "challenge_completion",
                "user": {
                    "id": 321,
                    "username": "YogaMaster",
                    "avatar": "🧘‍♀️",
                    "level": 6,
                    "is_friend": False,
                    "is_following": True
                },
                "timestamp": "2024-01-15T14:20:00Z",
                "content": {
                    "challenge": {
                        "name": "🌅 Morning Warrior Challenge",
                        "completed_goal": "20 morning workouts",
                        "rank": 3,
                        "participants": 247
                    },
                    "final_stats": {
                        "workouts_completed": 22,
                        "avg_start_time": "6:15 AM",
                        "total_minutes": 1100
                    }
                },
                "engagement": {
                    "likes": 12,
                    "comments": 2,
                    "motivations": 9,
                    "user_liked": False,
                    "user_motivated": False
                }
            }
        ],
        "pagination": {
            "current_offset": offset,
            "limit": limit,
            "has_more": True,
            "total_posts": 156
        },
        "filter_stats": {
            "all": 156,
            "friends": 89,
            "following": 34,
            "popular": 23
        }
    }

@router.post("/posts")
async def create_workout_post(
    post: WorkoutPost,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Share a completed workout with the community"""
    
    # Create workout post in database
    
    return {
        "message": "Workout posted successfully!",
        "post_id": "post_126",
        "visibility": post.visibility,
        "estimated_reach": 45 if post.visibility == "friends" else 150,
        "motivational_boost": 25  # points earned for sharing
    }

@router.get("/posts/{post_id}")
async def get_post_details(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed view of a specific post with comments"""
    
    return {
        "post": {
            "id": post_id,
            "type": "workout_completion",
            "user": {
                "id": 456,
                "username": "FitnessGuru",
                "avatar": "🏋️‍♂️",
                "level": 7,
                "is_friend": True
            },
            "timestamp": "2024-01-15T18:30:00Z",
            "content": {
                "workout_type": "Upper Body Strength",
                "duration": 65,
                "calories": 420,
                "exercises": [
                    {"name": "Bench Press", "sets": 4, "reps": 8, "weight": 225},
                    {"name": "Pull-ups", "sets": 3, "reps": 12},
                    {"name": "Shoulder Press", "sets": 3, "reps": 10, "weight": 135}
                ],
                "notes": "Crushed that PR on bench press! 💪"
            }
        },
        "comments": [
            {
                "id": "comment_1",
                "user": {
                    "id": 789,
                    "username": "RunnerGirl",
                    "avatar": "🏃‍♀️"
                },
                "content": "Amazing PR! Keep crushing it! 💪",
                "timestamp": "2024-01-15T19:15:00Z",
                "likes": 3,
                "user_liked": False
            },
            {
                "id": "comment_2", 
                "user": {
                    "id": 234,
                    "username": "IronLifter",
                    "avatar": "⚡"
                },
                "content": "That's some serious weight! What's your next goal?",
                "timestamp": "2024-01-15T20:02:00Z",
                "likes": 1,
                "user_liked": True,
                "replies": [
                    {
                        "id": "reply_1",
                        "user": {
                            "id": 456,
                            "username": "FitnessGuru",
                            "avatar": "🏋️‍♂️"
                        },
                        "content": "Aiming for 250 next month! 🎯",
                        "timestamp": "2024-01-15T20:30:00Z",
                        "likes": 2
                    }
                ]
            }
        ],
        "engagement": {
            "total_likes": 15,
            "total_comments": 3,
            "total_motivations": 7,
            "user_interactions": {
                "liked": False,
                "commented": False,
                "motivated": True
            }
        }
    }

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like or unlike a post"""
    
    # Toggle like status in database
    
    return {
        "message": "Post liked!",
        "post_id": post_id,
        "liked": True,
        "total_likes": 16
    }

@router.post("/posts/{post_id}/motivate")
async def motivate_user(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send motivation/encouragement to a user's post"""
    
    return {
        "message": "Motivation sent! 🔥",
        "post_id": post_id,
        "motivation_points_given": 5,
        "motivation_points_earned": 2,  # for giving encouragement
        "total_motivations": 8
    }

@router.post("/posts/{post_id}/comments")
async def add_comment(
    post_id: str,
    comment: Comment,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a comment to a post"""
    
    return {
        "message": "Comment added successfully!",
        "comment_id": "comment_3",
        "post_id": post_id,
        "content": comment.content,
        "timestamp": datetime.now().isoformat(),
        "engagement_points": 3  # points for community engagement
    }

@router.get("/friends")
async def get_friends_list(
    status: str = Query("confirmed", regex="^(confirmed|pending|requested)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's friends list with different status filters"""
    
    return {
        "friends": [
            {
                "id": 456,
                "username": "FitnessGuru",
                "avatar": "🏋️‍♂️",
                "level": 7,
                "friendship_date": "2024-01-01",
                "activity": {
                    "last_workout": "2024-01-15",
                    "current_streak": 12,
                    "total_workouts": 89
                },
                "shared_challenges": 3,
                "mutual_friends": 8
            },
            {
                "id": 789,
                "username": "RunnerGirl", 
                "avatar": "🏃‍♀️",
                "level": 5,
                "friendship_date": "2024-01-08",
                "activity": {
                    "last_workout": "2024-01-14",
                    "current_streak": 8,
                    "total_workouts": 67
                },
                "shared_challenges": 1,
                "mutual_friends": 12
            }
        ],
        "summary": {
            "total_friends": 15,
            "active_today": 6,
            "in_shared_challenges": 9,
            "pending_requests": 2
        },
        "friend_activity_summary": {
            "total_workouts_this_week": 45,
            "avg_friend_level": 6.2,
            "most_active_friend": "FitnessGuru",
            "longest_streak": 28
        }
    }

@router.post("/friends/{user_id}/request")
async def send_friend_request(
    user_id: int,
    message: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a friend request to another user"""
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send friend request to yourself"
        )
    
    return {
        "message": "Friend request sent!",
        "recipient_id": user_id,
        "request_id": "req_123",
        "custom_message": message,
        "estimated_response_time": "2-3 days"
    }

@router.post("/friends/requests/{request_id}/accept")
async def accept_friend_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept a pending friend request"""
    
    return {
        "message": "Friend request accepted! 🎉",
        "request_id": request_id,
        "new_friend": {
            "id": 567,
            "username": "NewFriend",
            "avatar": "💪"
        },
        "bonus_points": 25,  # for expanding social network
        "suggested_challenges": [
            "Partner Accountability Challenge",
            "Friendly Competition Weekly"
        ]
    }

@router.get("/leaderboards")
async def get_social_leaderboards(
    period: str = Query("weekly", regex="^(daily|weekly|monthly|all_time)$"),
    category: str = Query("all", regex="^(all|workouts|consistency|social)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get various social leaderboards and rankings"""
    
    return {
        "period": period,
        "category": category,
        "leaderboards": {
            "workout_volume": [
                {
                    "rank": 1,
                    "user": {"id": 456, "username": "IronLifter", "avatar": "🏋️"},
                    "value": 125000,  # total weight lifted
                    "unit": "lbs",
                    "change_from_last": "+2"
                },
                {
                    "rank": 2,
                    "user": {"id": 789, "username": "CardioQueen", "avatar": "🏃‍♀️"},
                    "value": 98500,
                    "unit": "lbs", 
                    "change_from_last": "-1"
                }
            ],
            "consistency": [
                {
                    "rank": 1,
                    "user": {"id": 234, "username": "SteadyEddie", "avatar": "⚡"},
                    "value": 98.5,  # consistency percentage
                    "unit": "%",
                    "streak": 45
                }
            ],
            "social_engagement": [
                {
                    "rank": 1,
                    "user": {"id": 345, "username": "Motivator", "avatar": "👏"},
                    "value": 245,  # motivations given
                    "unit": "motivations",
                    "friends_helped": 23
                }
            ]
        },
        "user_rankings": {
            "workout_volume": {"rank": 15, "percentile": 78},
            "consistency": {"rank": 8, "percentile": 92},
            "social_engagement": {"rank": 22, "percentile": 65}
        },
        "next_rank_requirements": {
            "workout_volume": {"needed": 2500, "timeframe": "this week"},
            "consistency": {"needed": "3 more workouts", "timeframe": "this week"}
        }
    }

@router.get("/challenges/social")
async def get_social_challenges(
    status: str = Query("active", regex="^(active|completed|available)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get social challenges that involve friends and community"""
    
    return {
        "active_challenges": [
            {
                "id": "buddy_system_jan",
                "name": "🤝 Buddy System Challenge",
                "description": "Work out with a friend 15 times this month",
                "type": "partner",
                "participants": [
                    {"id": 456, "username": "FitnessGuru", "avatar": "🏋️‍♂️"},
                    {"id": current_user.id, "username": "You", "avatar": "💪"}
                ],
                "progress": {
                    "completed": 8,
                    "target": 15,
                    "days_remaining": 12
                },
                "rewards": {
                    "points": 500,
                    "badge": "🤝 Partner in Sweat",
                    "exclusive_workout": True
                }
            },
            {
                "id": "motivate_squad_jan",
                "name": "💬 Motivation Squad",
                "description": "Give 100 motivations to community members",
                "type": "community",
                "progress": {
                    "completed": 67,
                    "target": 100,
                    "daily_average": 3.2
                },
                "leaderboard_position": 8,
                "total_participants": 2341
            }
        ],
        "available_challenges": [
            {
                "id": "team_transformation",
                "name": "🏆 Team Transformation",
                "description": "Create a team of 5 friends for ultimate accountability",
                "requirements": "4 friends needed",
                "starts_in": "3 days",
                "estimated_participants": 500
            }
        ],
        "challenge_invites": [
            {
                "id": "invite_123",
                "challenge": "🔥 February Fitness Frenzy",
                "from_friend": {
                    "id": 789,
                    "username": "RunnerGirl",
                    "avatar": "🏃‍♀️"
                },
                "message": "Let's crush this challenge together! 💪",
                "expires_in": "2 days"
            }
        ]
    }

@router.post("/challenges/{challenge_id}/invite")
async def invite_friends_to_challenge(
    challenge_id: str,
    invite: ChallengeInvite,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invite friends to join a challenge"""
    
    return {
        "message": f"Invitations sent to {len(invite.friend_ids)} friends!",
        "challenge_id": challenge_id,
        "invites_sent": len(invite.friend_ids),
        "custom_message": invite.custom_message,
        "bonus_points": len(invite.friend_ids) * 5,  # 5 points per invite
        "expected_responses": "within 48 hours"
    }

@router.get("/discovery")
async def discover_users(
    criteria: str = Query("similar_goals", regex="^(similar_goals|nearby|new_users|active)$"),
    limit: int = Query(10, le=20),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Discover new users to connect with based on various criteria"""
    
    return {
        "criteria": criteria,
        "suggested_users": [
            {
                "id": 901,
                "username": "StrengthSeeker",
                "avatar": "🦾",
                "level": 6,
                "similarity_score": 94,
                "common_interests": ["Powerlifting", "Nutrition tracking", "Morning workouts"],
                "mutual_friends": ["FitnessGuru", "IronLifter"],
                "activity": {
                    "workouts_this_month": 18,
                    "current_streak": 9,
                    "favorite_exercises": ["Deadlift", "Squat", "Bench Press"]
                },
                "goals": ["Increase deadlift to 400lbs", "Lose 5% body fat"],
                "location": "Within 25 miles",
                "match_reasons": [
                    "Similar strength training goals",
                    "Both prefer morning workouts",
                    "Mutual friends recommend"
                ]
            },
            {
                "id": 902,
                "username": "YogaEnthusiast",
                "avatar": "🧘‍♀️",
                "level": 4,
                "similarity_score": 87,
                "common_interests": ["Flexibility", "Mind-body connection", "Recovery"],
                "mutual_friends": ["WellnessGuru"],
                "activity": {
                    "workouts_this_month": 22,
                    "current_streak": 15,
                    "favorite_exercises": ["Yoga flows", "Meditation", "Stretching"]
                },
                "goals": ["Master advanced poses", "Improve flexibility"],
                "location": "Within 10 miles"
            }
        ],
        "discovery_stats": {
            "total_potential_connections": 847,
            "highly_compatible": 23,
            "in_your_area": 156,
            "with_mutual_friends": 89
        }
    }

@router.get("/groups")
async def get_fitness_groups(
    category: str = Query("all", regex="^(all|workout|nutrition|goals|local)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get fitness groups and communities to join"""
    
    return {
        "joined_groups": [
            {
                "id": "powerlifting_pros",
                "name": "💪 Powerlifting Pros",
                "description": "Serious lifters sharing PRs and techniques",
                "members": 1247,
                "activity_level": "Very High",
                "your_role": "Member",
                "joined_date": "2024-01-05",
                "recent_posts": 156,
                "upcoming_events": [
                    {
                        "name": "Virtual Powerlifting Meet",
                        "date": "2024-02-15",
                        "participants": 89
                    }
                ]
            }
        ],
        "recommended_groups": [
            {
                "id": "morning_warriors",
                "name": "🌅 Morning Warriors",
                "description": "Early birds who crush workouts before sunrise",
                "members": 2341,
                "activity_level": "High",
                "match_score": 92,
                "why_recommended": "You frequently work out in the morning",
                "recent_activity": "45 posts this week"
            },
            {
                "id": "local_lifters_chicago",
                "name": "🏙️ Chicago Lifters",
                "description": "Local fitness community in the Windy City",
                "members": 892,
                "activity_level": "Medium",
                "match_score": 85,
                "why_recommended": "Based on your location",
                "upcoming_meetup": "Gym session - Saturday 2PM"
            }
        ],
        "group_categories": [
            {"name": "Workout Types", "count": 23},
            {"name": "Nutrition Focus", "count": 18},
            {"name": "Goal-Based", "count": 34},
            {"name": "Local Communities", "count": 67},
            {"name": "Challenge Groups", "count": 45}
        ]
    } 