# Smart Fitness & Nutrition Coach

A comprehensive web application that acts as a digital fitness and nutrition coach, providing personalized workout and meal plans based on user preferences, goals, and lifestyle.

## 🚀 Current Status: Phase 1 MVP Complete!

This project implements a fully functional fitness and nutrition planning application with:

✅ **Complete Backend Infrastructure**
- FastAPI with comprehensive REST API
- SQLAlchemy ORM with detailed database models
- JWT-based authentication system
- Rule-based plan generation engine
- Mifflin-St Jeor calorie calculation
- Sample exercise and recipe database

✅ **Modern React Frontend**
- React 18 with React Router v6
- Styled-components for modern UI
- Authentication flow with protected routes
- Responsive design with mobile support
- User-friendly login interface

✅ **Database & Data**
- Comprehensive database schema for users, exercises, recipes, and plans
- Pre-seeded with sample exercises and recipes
- SQLite database for easy setup (PostgreSQL ready)

## 🎯 Project Vision

### Phase 1: Foundation - MVP ✅ **COMPLETE**
- User authentication and onboarding
- Rule-based plan generation
- Exercise and recipe databases
- Basic calorie calculation and plan assembly

### Phase 2: ML Recommender System 🚧 **NEXT**
- Content-based recommendation engine
- Personalized exercise and meal suggestions
- Feature engineering and similarity calculations

### Phase 3: Advanced AI - Reinforcement Learning 📅 **FUTURE**
- Dynamic and adaptive planning
- User feedback learning
- Continuous plan optimization

## 🛠 Tech Stack

- **Frontend**: React 18, React Router, Styled Components, React Query
- **Backend**: FastAPI, SQLAlchemy, Alembic, Python 3.8+
- **Database**: SQLite (default) / PostgreSQL
- **Authentication**: JWT with bcrypt password hashing
- **Development**: Hot reloading, modern ES6+, responsive design

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd fitnesstracker

# Run the automated setup script
python setup.py
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample data
python seed_data.py

# Start the backend server
uvicorn main:app --reload
```

The backend will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

#### Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at: http://localhost:3000

## 🗄️ Database Schema

### Users
- User profile and authentication data
- Physical stats (age, gender, height, weight)
- Goals and dietary restrictions
- Calculated metrics (BMR, TDEE, target calories)

### Exercises
- Exercise metadata and categorization
- Equipment requirements and difficulty levels
- Default sets/reps and instructions
- Video links and muscle group targeting

### Recipes
- Recipe details and nutritional information
- Dietary tags and allergen information
- Cooking instructions and preparation time
- Macro and micronutrient breakdown

### Plans
- Generated workout and meal plans
- User plan history and feedback
- Performance tracking data

## 🔑 Key Features

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and user sessions
- Auto-login after registration

### Rule-Based Plan Generation
- **Calorie Calculation**: Mifflin-St Jeor equation for BMR
- **Activity Multipliers**: Sedentary to very active levels
- **Goal-Based Adjustments**: Weight loss (-500 cal), muscle gain (+300 cal)
- **Equipment Filtering**: Plans based on available equipment
- **Dietary Compliance**: Automatic filtering for allergies and preferences

### Exercise Database
Sample exercises include:
- Bodyweight: Push-ups, Squats, Planks
- Dumbbell: Chest Press, Rows, Shoulder Press
- Cardio: Jumping Jacks, Burpees
- Advanced: Pull-ups, compound movements

### Recipe Database
Sample recipes include:
- **Breakfast**: Protein Pancakes, Overnight Oats
- **Lunch**: Grilled Chicken Salad, Quinoa Buddha Bowl
- **Dinner**: Baked Salmon, Turkey Meatballs
- **Snacks**: Greek Yogurt with Berries

## 🔐 Demo Credentials

Since this is a development build, you can create a new account through the registration flow or use the seeded data by creating an account.

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for comprehensive interactive API documentation with:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with consistent theming
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clear menu structure with visual indicators
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: User-friendly error messages and validation
- **Accessibility**: Focus management and keyboard navigation

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database (optional - defaults to SQLite)
DATABASE_URL=sqlite:///./fitnesstracker.db

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Database Options

**SQLite (Default)**
- No additional setup required
- Perfect for development and demo
- Database file: `backend/fitnesstracker.db`

**PostgreSQL (Production)**
```env
DATABASE_URL=postgresql://username:password@localhost/fitnesstracker
```

## 🚦 Development Workflow

1. **Backend Changes**: Automatic reload with `--reload` flag
2. **Frontend Changes**: Hot module replacement with React
3. **Database Changes**: Use Alembic migrations
4. **New Dependencies**: Update requirements.txt or package.json

## 📈 Future Roadmap

### Phase 2: Machine Learning Integration
- Content-based filtering for exercise/recipe recommendations
- User preference learning from interaction data
- Similarity calculations using cosine similarity
- Feature engineering for exercise and recipe embeddings

### Phase 3: Advanced AI Features
- Reinforcement learning for adaptive planning
- Multi-armed bandit for A/B testing different plan types
- Real-time plan adjustments based on user feedback
- Advanced analytics and progress tracking

## 🤝 Contributing

This is a portfolio/learning project demonstrating full-stack development skills with progressive AI/ML integration. The codebase is designed to be:

- **Scalable**: Easy to add new features and components
- **Maintainable**: Clear separation of concerns and clean architecture
- **Educational**: Well-documented code showing best practices
- **Production-Ready**: Security, error handling, and performance considerations

## 📄 License

This project is for educational and portfolio purposes.

---

## 💡 Key Achievements

This project demonstrates:

1. **Full-Stack Development**: Complete application from database to UI
2. **Modern Web Technologies**: Latest React and FastAPI patterns
3. **Database Design**: Comprehensive schema with relationships
4. **Authentication & Security**: JWT, password hashing, protected routes
5. **API Design**: RESTful endpoints with proper documentation
6. **Business Logic**: Real-world fitness calculation algorithms
7. **UI/UX Design**: Professional, responsive interface
8. **Code Organization**: Scalable architecture for future ML integration

Ready to showcase advanced development skills and machine learning integration! 🎉 