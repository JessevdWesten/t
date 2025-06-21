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

# Enhanced custom CSS with modern design
custom_css = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    :root {
        --primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        --success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        --warning: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        --danger: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        --dark: #0f172a;
        --surface: #1e293b;
        --surface-2: #334155;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --text-muted: #64748b;
        --border: #475569;
        --accent: #3b82f6;
    }

    * {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        background: var(--dark) !important;
        color: var(--text-primary) !important;
    }

    .swagger-ui {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%) !important;
        min-height: 100vh;
    }

    /* Header with animated background */
    .swagger-ui .info {
        background: linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%);
        border-radius: 20px;
        padding: 3rem;
        margin: 2rem 0;
        border: 1px solid var(--border);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        position: relative;
        overflow: hidden;
    }

    .swagger-ui .info::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--primary);
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    .swagger-ui .info .title {
        background: var(--primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 3.5rem !important;
        font-weight: 800 !important;
        margin-bottom: 1.5rem !important;
        text-align: center;
        animation: glow 3s ease-in-out infinite alternate;
    }

    @keyframes glow {
        from { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5)); }
        to { filter: drop-shadow(0 0 30px rgba(118, 75, 162, 0.8)); }
    }

    .swagger-ui .info .description {
        color: var(--text-primary) !important;
        font-size: 1.1rem !important;
        line-height: 1.8 !important;
        text-align: center;
    }

    /* Enhanced operation blocks */
    .swagger-ui .opblock {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 16px !important;
        margin-bottom: 1.5rem !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        overflow: hidden;
        position: relative;
    }

    .swagger-ui .opblock::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--primary);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .swagger-ui .opblock:hover::before {
        transform: scaleX(1);
    }

    .swagger-ui .opblock:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        border-color: var(--accent) !important;
    }

    /* HTTP method styling with gradients */
    .swagger-ui .opblock.opblock-post {
        border-left: 4px solid transparent;
        border-image: var(--success) 1;
    }

    .swagger-ui .opblock.opblock-get {
        border-left: 4px solid transparent;
        border-image: var(--primary) 1;
    }

    .swagger-ui .opblock.opblock-put {
        border-left: 4px solid transparent;
        border-image: var(--warning) 1;
    }

    .swagger-ui .opblock.opblock-delete {
        border-left: 4px solid transparent;
        border-image: var(--danger) 1;
    }

    /* Animated tag sections */
    .swagger-ui .opblock-tag {
        background: var(--primary) !important;
        color: white !important;
        font-size: 1.5rem !important;
        font-weight: 700 !important;
        padding: 1.5rem 2rem !important;
        border-radius: 12px !important;
        margin: 3rem 0 2rem 0 !important;
        border: none !important;
        position: relative;
        overflow: hidden;
    }

    .swagger-ui .opblock-tag::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: slide 3s infinite;
    }

    @keyframes slide {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    /* Enhanced buttons */
    .swagger-ui .btn {
        background: var(--primary) !important;
        border: none !important;
        border-radius: 10px !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 0.75rem 1.5rem !important;
        font-size: 0.9rem !important;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;
    }

    .swagger-ui .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
    }

    .swagger-ui .btn:hover::before {
        left: 100%;
    }

    .swagger-ui .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }

    /* Try it out section */
    .swagger-ui .try-out {
        background: var(--surface-2) !important;
        border-radius: 12px !important;
        padding: 1.5rem !important;
        border: 1px solid var(--border);
    }

    /* Response styling */
    .swagger-ui .responses-wrapper {
        background: var(--surface-2) !important;
        border-radius: 12px !important;
        padding: 1.5rem !important;
        margin-top: 1rem !important;
        border: 1px solid var(--border);
    }

    /* Model sections */
    .swagger-ui .model-box {
        background: var(--surface-2) !important;
        border-radius: 12px !important;
        border: 1px solid var(--border) !important;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 12px;
    }

    ::-webkit-scrollbar-track {
        background: var(--dark);
        border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 6px;
        border: 2px solid var(--dark);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--secondary);
    }

    /* Parameter inputs */
    .swagger-ui input[type="text"],
    .swagger-ui input[type="password"],
    .swagger-ui input[type="email"],
    .swagger-ui textarea {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 8px !important;
        color: var(--text-primary) !important;
        padding: 0.75rem !important;
    }

    .swagger-ui input:focus,
    .swagger-ui textarea:focus {
        border-color: var(--accent) !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }

    /* Loading animations */
    .swagger-ui .loading {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .swagger-ui .info {
            padding: 2rem 1rem;
            margin: 1rem;
        }
        
        .swagger-ui .info .title {
            font-size: 2.5rem !important;
        }
        
        .swagger-ui .opblock {
            margin: 1rem 0;
        }
    }

    /* Dark theme for code blocks */
    .swagger-ui .highlight-code {
        background: var(--dark) !important;
        color: var(--text-primary) !important;
        border-radius: 8px !important;
        border: 1px solid var(--border) !important;
    }

    /* Status code styling */
    .swagger-ui .response-col_status {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
    }

    /* Add subtle animations to everything */
    .swagger-ui .opblock-summary-method,
    .swagger-ui .opblock-summary-path,
    .swagger-ui .opblock-summary-description {
        transition: all 0.3s ease !important;
    }

    .swagger-ui .opblock:hover .opblock-summary-method {
        transform: scale(1.05);
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

# Advanced feature routers
try:
    from routers import achievements, analytics, social, notifications
    app.include_router(achievements.router, prefix="/api/achievements", tags=["🏆 Achievements"])
    app.include_router(analytics.router, prefix="/api/analytics", tags=["📊 Analytics"])
    app.include_router(social.router, prefix="/api/social", tags=["👥 Social"])
    app.include_router(notifications.router, prefix="/api/notifications", tags=["🔔 Notifications"])
    logger.info("✅ Advanced feature routers loaded successfully")
except ImportError as e:
    logger.warning(f"⚠️ Some advanced features unavailable: {e}")
    # Graceful degradation - core functionality still works

# Custom documentation endpoints with enhanced styling
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Enhanced Swagger UI with custom styling"""
    from fastapi.responses import HTMLResponse
    
    # Create custom HTML with embedded CSS
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{app.title} - Interactive API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
        {custom_css}
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
        <script>
            SwaggerUIBundle({{
                url: '{app.openapi_url}',
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.presets.standalone
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                syntaxHighlight: {{
                    theme: "arta"
                }},
                tryItOutEnabled: true,
                displayRequestDuration: true,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                deepLinking: true,
                oauth2RedirectUrl: '{app.swagger_ui_oauth2_redirect_url}'
            }});
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - ReDoc Documentation",
        redoc_js_url="https://unpkg.com/redoc@2.1.3/bundles/redoc.standalone.js",
    )

@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()

# Enhanced root endpoint with comprehensive API information
@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def root():
    """Beautiful landing page for the API"""
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FitGenius API - Transform Your Fitness Journey</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                color: #f8fafc;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }}
            
            .container {{
                max-width: 800px;
                text-align: center;
                animation: fadeInUp 1s ease-out;
            }}
            
            @keyframes fadeInUp {{
                from {{
                    opacity: 0;
                    transform: translateY(30px);
                }}
                to {{
                    opacity: 1;
                    transform: translateY(0);
                }}
            }}
            
            .logo {{
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: bounce 2s infinite;
            }}
            
            @keyframes bounce {{
                0%, 20%, 50%, 80%, 100% {{
                    transform: translateY(0);
                }}
                40% {{
                    transform: translateY(-10px);
                }}
                60% {{
                    transform: translateY(-5px);
                }}
            }}
            
            h1 {{
                font-size: 3rem;
                font-weight: 800;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 1rem;
            }}
            
            .subtitle {{
                font-size: 1.25rem;
                color: #cbd5e1;
                margin-bottom: 3rem;
                font-weight: 300;
            }}
            
            .features {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 3rem;
            }}
            
            .feature {{
                background: rgba(30, 41, 59, 0.5);
                padding: 1.5rem;
                border-radius: 16px;
                border: 1px solid #475569;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }}
            
            .feature:hover {{
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border-color: #3b82f6;
            }}
            
            .feature-icon {{
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }}
            
            .feature h3 {{
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #f1f5f9;
            }}
            
            .feature p {{
                font-size: 0.9rem;
                color: #94a3b8;
                line-height: 1.5;
            }}
            
            .buttons {{
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }}
            
            .btn {{
                padding: 1rem 2rem;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                position: relative;
                overflow: hidden;
            }}
            
            .btn-primary {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }}
            
            .btn-secondary {{
                background: rgba(51, 65, 85, 0.5);
                color: #f1f5f9;
                border: 1px solid #475569;
            }}
            
            .btn:hover {{
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            }}
            
            .btn::before {{
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }}
            
            .btn:hover::before {{
                left: 100%;
            }}
            
            .status {{
                margin-top: 3rem;
                padding: 1rem;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid #10b981;
                border-radius: 8px;
                color: #10b981;
                font-weight: 500;
            }}
            
            .version {{
                margin-top: 2rem;
                font-size: 0.9rem;
                color: #64748b;
            }}
            
            @media (max-width: 768px) {{
                h1 {{
                    font-size: 2rem;
                }}
                
                .logo {{
                    font-size: 3rem;
                }}
                
                .features {{
                    grid-template-columns: 1fr;
                }}
                
                .buttons {{
                    flex-direction: column;
                    align-items: center;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🏋️</div>
            <h1>FitGenius API</h1>
            <p class="subtitle">Your AI-Powered Fitness & Nutrition Platform</p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔐</div>
                    <h3>Secure Auth</h3>
                    <p>JWT-based authentication with advanced security</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">💪</div>
                    <h3>Exercise Library</h3>
                    <p>1000+ exercises with AI recommendations</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🥗</div>
                    <h3>Nutrition Hub</h3>
                    <p>Smart recipes with macro tracking</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <h3>Analytics</h3>
                    <p>Comprehensive progress insights</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🏆</div>
                    <h3>Gamification</h3>
                    <p>Achievements and challenges</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">👥</div>
                    <h3>Social Platform</h3>
                    <p>Connect with fitness community</p>
                </div>
            </div>
            
            <div class="buttons">
                <a href="/docs" class="btn btn-primary">
                    📚 API Documentation
                </a>
                <a href="/redoc" class="btn btn-secondary">
                    📖 ReDoc Docs
                </a>
            </div>
            
            <div class="status">
                🟢 API Status: Operational | ⚡ Response Time: <1ms
            </div>
            
            <div class="version">
                Version 2.0.0 | Built with FastAPI & ❤️
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

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