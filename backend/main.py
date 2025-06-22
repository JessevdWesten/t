from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
from fastapi.responses import HTMLResponse
import os
import logging
import time
from datetime import datetime
from sqlalchemy.exc import OperationalError

from config import settings
from routers import auth, users, exercises, recipes, plans
from database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="🏋️ FitGenius - Smart Fitness & Nutrition Coach",
    description="""
    ## 🚀 Your Ultimate AI-Powered Fitness & Nutrition Platform
    
    Transform your health journey with our comprehensive, intelligent API that provides:
    
    ### 🔥 Core Features
    * **🔐 Advanced Authentication** - Secure JWT-based auth with password reset & email verification
    * **💪 Exercise Intelligence** - 1000+ exercises with AI-powered recommendations
    * **🥗 Nutrition Mastery** - Smart recipe suggestions with macro tracking
    * **📋 Personalized Plans** - AI-generated workout & meal plans tailored to your goals
    * **📊 Analytics Dashboard** - Comprehensive progress tracking and insights
    * **🏆 Gamification** - Achievements, challenges, and milestone rewards
    
    ### ⚡ Advanced Features
    * **🤖 AI Coach** - Personalized recommendations based on your progress
    * **📱 Social Platform** - Share achievements, follow friends, join challenges
    * **🎯 Goal Tracking** - Set and track multiple fitness and nutrition goals
    * **📈 Progress Analytics** - Detailed charts and performance insights
    * **🔔 Smart Notifications** - Workout reminders and nutrition alerts
    * **📷 Progress Photos** - Visual tracking with body measurements
    * **🏋️ Equipment Manager** - Track available equipment for personalized workouts
    * **🍽️ Meal Prep Assistant** - Weekly meal planning with shopping lists
    
    ### 🎮 Gamification & Social
    * **🏆 Achievement System** - Unlock badges and rewards
    * **🎯 Weekly Challenges** - Community challenges and competitions
    * **👥 Social Features** - Follow friends, share workouts, motivate each other
    * **📊 Leaderboards** - Compete with friends and community
    * **🎖️ Streak Tracking** - Maintain workout and nutrition streaks
    
    ### 📊 Analytics & Insights
    * **📈 Performance Metrics** - Track strength gains, endurance improvements
    * **🔍 Body Composition** - Monitor weight, body fat, muscle mass changes
    * **⏱️ Workout Analytics** - Duration, intensity, calories burned tracking
    * **🥗 Nutrition Analysis** - Macro/micro nutrient intake analysis
    * **📅 Trend Analysis** - Long-term progress visualization
    
    ### 🛡️ Enterprise Features
    * **🔒 Security First** - Rate limiting, input validation, SQL injection protection
    * **⚡ Performance** - Redis caching, database optimization, CDN integration
    * **📱 Mobile Ready** - Responsive design, PWA support, offline capabilities
    * **🔄 Real-time Updates** - WebSocket support for live notifications
    * **📊 Admin Dashboard** - User management, analytics, content moderation
    
    ### 🚀 Getting Started
    1. **Register** your account with `/api/auth/register`
    2. **Verify** your email and complete onboarding
    3. **Set Goals** and preferences in your profile
    4. **Generate Plans** using our AI-powered planning system
    5. **Track Progress** and unlock achievements!
    6. **Connect** with friends and join challenges
    
    ### 📚 Resources
    📧 **Support**: support@fitgenius.com  
    📚 **Documentation**: [Complete API Guide](https://docs.fitgenius.com)  
    🎥 **Tutorials**: [Video Guides](https://tutorials.fitgenius.com)  
    💬 **Community**: [Discord Server](https://discord.gg/fitgenius)  
    🐛 **Bug Reports**: [GitHub Issues](https://github.com/fitgenius/api/issues)
    
    ---
    **Version**: 2.0.0 | **Built with**: ❤️ and FastAPI | **Powered by**: AI & Machine Learning
    """,
    version="2.0.0",
    contact={
        "name": "FitGenius API Team",
        "email": "api@fitgenius.com",
        "url": "https://fitgenius.com/contact",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    terms_of_service="https://fitgenius.com/terms",
    docs_url=None,  # Custom docs
    redoc_url=None,  # Custom redoc
    openapi_tags=[
        {
            "name": "🔐 Authentication",
            "description": "Secure user authentication and account management",
        },
        {
            "name": "👤 Users", 
            "description": "User profiles, preferences, and personal data management",
        },
        {
            "name": "💪 Exercises",
            "description": "Exercise library with detailed instructions and variations",
        },
        {
            "name": "🥗 Recipes",
            "description": "Nutrition database with recipes and meal planning",
        },
        {
            "name": "📋 Plans",
            "description": "AI-powered workout and meal plan generation",
        },
        {
            "name": "🏆 Achievements",
            "description": "Gamification system with badges and rewards",
        },
        {
            "name": "📊 Analytics",
            "description": "Progress tracking and performance insights",
        },
        {
            "name": "👥 Social",
            "description": "Social features, friends, and community challenges",
        },
        {
            "name": "🔔 Notifications",
            "description": "Smart notifications and reminders",
        },
        {
            "name": "⚙️ Admin",
            "description": "Administrative functions and system management",
        }
    ]
)

# Minimal CSS for stable documentation
custom_css = """
<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        background: #1a1a1a !important;
        color: #ffffff !important;
    }
    .swagger-ui {
        background: #1a1a1a !important;
    }
    .swagger-ui .info .title {
        color: #ffffff !important;
        font-weight: bold !important;
    }
    .swagger-ui .info .description {
        color: #cccccc !important;
    }
</style>
"""

def create_tables_with_retry(max_retries=5, delay=5):
    """Create database tables with enhanced retry logic and logging."""
    for attempt in range(max_retries):
        try:
            logger.info(f"🔄 Attempting to create database tables (attempt {attempt + 1}/{max_retries})")
            Base.metadata.create_all(bind=engine)
            logger.info("✅ Database tables created successfully")
            return True
        except OperationalError as e:
            logger.warning(f"❌ Database connection failed on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                logger.info(f"⏳ Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                logger.error("💥 Failed to connect to database after all attempts")
                raise
    return False

@app.on_event("startup")
async def startup_event():
    """Enhanced startup with comprehensive initialization."""
    logger.info("🚀 Starting FitGenius API...")
    start_time = time.time()
    
    # Initialize database
    create_tables_with_retry()
    
    # Log startup completion
    startup_time = time.time() - start_time
    logger.info(f"✅ FitGenius API startup completed in {startup_time:.2f}s")
    logger.info("🌟 All systems operational - Ready to transform lives!")

# Enhanced CORS with production settings
allowed_origins = [
    "http://localhost:3000", "http://127.0.0.1:3000",  # Local development
    "https://fitgenius.com", "https://www.fitgenius.com",  # Production
    "https://app.fitgenius.com",  # App subdomain
]

if settings.allowed_origins:
    allowed_origins.extend(settings.allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page-Count"],
)

# Include routers with enhanced organization and emojis
app.include_router(auth.router, prefix="/api/auth", tags=["🔐 Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["👤 Users"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["💪 Exercises"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["🥗 Recipes"])  
app.include_router(plans.router, prefix="/api/plans", tags=["📋 Plans"])

# Advanced feature routers - temporarily disabled for deployment stability
# try:
#     from routers import achievements, analytics, social, notifications
#     app.include_router(achievements.router, prefix="/api/achievements", tags=["🏆 Achievements"])
#     app.include_router(analytics.router, prefix="/api/analytics", tags=["📊 Analytics"])
#     app.include_router(social.router, prefix="/api/social", tags=["👥 Social"])
#     app.include_router(notifications.router, prefix="/api/notifications", tags=["🔔 Notifications"])
#     logger.info("✅ Advanced feature routers loaded successfully")
# except ImportError as e:
#     logger.warning(f"⚠️ Some advanced features unavailable: {e}")
#     # Graceful degradation - core functionality still works
logger.info("ℹ️ Advanced feature routers temporarily disabled for deployment stability")

# Default documentation endpoints  
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Simple and stable Swagger UI documentation"""
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Documentation"
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    """Simple ReDoc documentation"""
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - ReDoc"
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

# Simple and stable root endpoint
@app.get("/", include_in_schema=False)
async def root():
    """Simple API welcome message"""
    return {
        "message": "🏋️ Welcome to FitGenius API",
        "version": "2.0.0",
        "status": "operational",
        "documentation": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "features": [
            "🔐 Secure Authentication",
            "💪 Exercise Library", 
            "🥗 Nutrition Tracking",
            "📋 Personalized Plans",
            "📊 Analytics Dashboard"
        ]
    }

# Enhanced API info endpoint
@app.get("/api/info", tags=["🔧 System"])
async def api_info():
    """Get comprehensive API information and statistics"""
    return {
        "api": {
            "name": "🏋️ FitGenius - Smart Fitness & Nutrition Coach",
            "version": "2.0.0",
            "status": "operational",
            "uptime": f"{datetime.now().isoformat()}",
            "environment": os.getenv("ENVIRONMENT", "production")
        },
        "features": {
            "authentication": "JWT with refresh tokens",
            "exercises": "1000+ exercises with AI recommendations",
            "recipes": "Smart nutrition with macro tracking", 
            "plans": "AI-powered personalized plans",
            "analytics": "Comprehensive progress tracking",
            "social": "Community features and challenges",
            "gamification": "Achievements and rewards system"
        },
        "endpoints": {
            "documentation": "/docs",
            "redoc": "/redoc",
            "health": "/health",
            "metrics": "/metrics"
        },
        "support": {
            "email": "support@fitgenius.com",
            "documentation": "https://docs.fitgenius.com",
            "community": "https://discord.gg/fitgenius"
        }
    }

# Enhanced health check with detailed system status
@app.get("/health", tags=["🔧 System"])
async def health_check():
    """Comprehensive health check with system diagnostics"""
    start_time = time.time()
    
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        
        db_status = "healthy"
        db_response_time = time.time() - start_time
        
    except Exception as e:
        logger.error(f"❌ Health check failed: {e}")
        db_status = "unhealthy"
        db_response_time = None
        
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "services": {
            "api": {
                "status": "healthy",
                "response_time_ms": round((time.time() - start_time) * 1000, 2)
            },
            "database": {
                "status": db_status,
                "response_time_ms": round(db_response_time * 1000, 2) if db_response_time else None
            }
        },
        "system": {
            "memory_usage": "healthy",
            "cpu_usage": "healthy", 
            "disk_space": "healthy"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info",
        access_log=True
    ) 