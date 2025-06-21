from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime

# Base User Schema
class UserBase(BaseModel):
    email: EmailStr

# User Creation Schema
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

# User Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User Profile Create/Update Schema
class UserProfileBase(BaseModel):
    first_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=13, le=120)
    gender: Optional[str] = None  # 'male', 'female', 'other'
    height_cm: Optional[int] = Field(None, gt=0, le=300)
    weight_kg: Optional[float] = Field(None, gt=0, le=1000)
    activity_level: Optional[str] = None  # 'sedentary', 'light', 'moderate', 'active', 'very_active'
    goal: Optional[str] = None  # 'weight_loss', 'maintenance', 'muscle_gain'
    preferences: Optional[Dict[str, Any]] = None  # {'diet': 'vegetarian', 'allergies': ['nuts'], 'equipment': ['dumbbells']}

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

# User Profile Response Schema
class UserProfileResponse(UserProfileBase):
    user_id: int
    updated_at: datetime
    
    class Config:
        orm_mode = True

# User Response Schema
class UserResponse(UserBase):
    id: int
    created_at: datetime
    profile: Optional[UserProfileResponse] = None
    
    class Config:
        orm_mode = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 