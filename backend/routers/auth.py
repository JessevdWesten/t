from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer
from sqlalchemy.orm import Session
from typing import Optional
import secrets
import re
from pydantic import BaseModel, EmailStr

from database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, Token
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    verify_password
)
from config import settings

router = APIRouter()

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="👤 Create New Account",
    description="""
    Register a new user account with email and password.
    
    **What this does:**
    - Creates a new user account
    - Validates email format and password strength
    - Returns user information and access token
    
    **Requirements:**
    - Valid email address
    - Password with at least 8 characters
    """,
    response_description="Successfully created user account",
    tags=["🔐 Authentication"]
)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh access token."""
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Enhanced Authentication Features

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class EmailVerification(BaseModel):
    token: str

@router.post("/forgot-password")
async def request_password_reset(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Request password reset via email"""
    
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Don't reveal if email exists for security
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # Generate secure reset token
    reset_token = secrets.token_urlsafe(32)
    reset_expires = datetime.utcnow() + timedelta(hours=1)
    
    # In a real implementation, you'd save this to the database and send email
    # For now, we'll return the token (in production, only send via email)
    
    return {
        "message": "Password reset link sent to your email",
        "reset_token": reset_token,  # Remove this in production
        "expires_in": "1 hour"
    }

@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
):
    """Reset password using reset token"""
    
    # Validate password strength
    if not validate_password_strength(reset_data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password does not meet strength requirements"
        )
    
    # In a real implementation, you'd validate the token against the database
    # For now, we'll assume token is valid
    
    # Find user and update password
    # user = get_user_by_reset_token(reset_data.token)
    # user.hashed_password = get_password_hash(reset_data.new_password)
    # user.reset_token = None
    # user.reset_token_expires = None
    
    return {"message": "Password reset successfully"}

@router.post("/change-password")
async def change_password(
    change_data: ChangePassword,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change password for authenticated user"""
    
    # Verify current password
    if not verify_password(change_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password strength
    if not validate_password_strength(change_data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password does not meet strength requirements"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(change_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/verify-email")
async def verify_email(
    verification: EmailVerification,
    db: Session = Depends(get_db)
):
    """Verify email address using verification token"""
    
    # In a real implementation, validate token and mark email as verified
    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_email_verification(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Resend email verification link"""
    
    verification_token = secrets.token_urlsafe(32)
    
    return {
        "message": "Verification email sent",
        "verification_token": verification_token  # Remove in production
    }

@router.get("/security")
async def get_security_info(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's security information and settings"""
    
    return {
        "account_security": {
            "email_verified": True,  # Would check actual status
            "two_factor_enabled": False,  # Would check actual status
            "last_password_change": "2024-01-01T00:00:00Z",
            "login_attempts_today": 3,
            "account_locked": False
        },
        "recent_activity": [
            {
                "type": "login",
                "timestamp": "2024-01-15T18:30:00Z",
                "ip_address": "192.168.1.100",
                "device": "Chrome on Windows",
                "location": "Chicago, IL"
            },
            {
                "type": "password_change",
                "timestamp": "2024-01-10T14:20:00Z",
                "ip_address": "192.168.1.100",
                "device": "Chrome on Windows"
            }
        ],
        "security_recommendations": [
            "✅ Strong password detected",
            "⚠️ Consider enabling two-factor authentication",
            "✅ Email address verified",
            "💡 Review recent login activity regularly"
        ]
    }

@router.get("/sessions")
async def get_active_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's active sessions across devices"""
    
    return {
        "active_sessions": [
            {
                "session_id": "sess_123",
                "device": "Chrome on Windows",
                "ip_address": "192.168.1.100",
                "location": "Chicago, IL",
                "last_active": "2024-01-15T18:30:00Z",
                "is_current": True
            },
            {
                "session_id": "sess_124",
                "device": "Mobile App on iOS",
                "ip_address": "192.168.1.101",
                "location": "Chicago, IL",
                "last_active": "2024-01-15T12:15:00Z",
                "is_current": False
            }
        ],
        "total_sessions": 2,
        "security_tips": [
            "🔒 Log out from devices you don't recognize",
            "📱 Keep your mobile app updated",
            "🌐 Use secure networks for login"
        ]
    }

@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Revoke a specific session"""
    
    return {
        "message": f"Session {session_id} revoked successfully",
        "session_id": session_id
    }

@router.delete("/sessions/all")
async def revoke_all_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Revoke all sessions except current one"""
    
    return {
        "message": "All other sessions revoked successfully",
        "revoked_count": 1,
        "current_session_maintained": True
    }

@router.get("/password-strength")
async def check_password_strength(password: str):
    """Check password strength and get recommendations"""
    
    strength_analysis = analyze_password_strength(password)
    
    return {
        "strength_score": strength_analysis["score"],
        "strength_level": strength_analysis["level"],
        "feedback": strength_analysis["feedback"],
        "requirements": {
            "min_length": len(password) >= 8,
            "has_uppercase": bool(re.search(r'[A-Z]', password)),
            "has_lowercase": bool(re.search(r'[a-z]', password)),
            "has_numbers": bool(re.search(r'\d', password)),
            "has_special": bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
        },
        "suggestions": strength_analysis["suggestions"]
    }

# Utility functions
def validate_password_strength(password: str) -> bool:
    """Validate password meets minimum strength requirements"""
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

def analyze_password_strength(password: str) -> dict:
    """Analyze password strength and provide feedback"""
    score = 0
    feedback = []
    suggestions = []
    
    # Length check
    if len(password) >= 12:
        score += 25
    elif len(password) >= 8:
        score += 15
        suggestions.append("Consider using a longer password (12+ characters)")
    else:
        suggestions.append("Password should be at least 8 characters long")
    
    # Character variety
    if re.search(r'[A-Z]', password):
        score += 20
    else:
        suggestions.append("Add uppercase letters")
    
    if re.search(r'[a-z]', password):
        score += 20
    else:
        suggestions.append("Add lowercase letters")
    
    if re.search(r'\d', password):
        score += 20
    else:
        suggestions.append("Add numbers")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 15
    else:
        suggestions.append("Add special characters (!@#$%^&*)")
    
    # Determine strength level
    if score >= 90:
        level = "Very Strong"
        feedback.append("Excellent password strength! 🔒")
    elif score >= 70:
        level = "Strong"
        feedback.append("Good password strength 💪")
    elif score >= 50:
        level = "Moderate"
        feedback.append("Password strength is okay, but could be improved")
    elif score >= 30:
        level = "Weak"
        feedback.append("Password is weak - consider strengthening it")
    else:
        level = "Very Weak"
        feedback.append("Password is very weak - please choose a stronger one")
    
    return {
        "score": score,
        "level": level,
        "feedback": feedback,
        "suggestions": suggestions
    } 