from sqlalchemy import Column, Integer, String, Float, Boolean, Text, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base

class MuscleGroupEnum(enum.Enum):
    CHEST = "chest"
    BACK = "back"
    SHOULDERS = "shoulders"
    ARMS = "arms"
    BICEPS = "biceps"
    TRICEPS = "triceps"
    LEGS = "legs"
    QUADS = "quads"
    HAMSTRINGS = "hamstrings"
    GLUTES = "glutes"
    CALVES = "calves"
    CORE = "core"
    ABS = "abs"
    CARDIO = "cardio"
    FULL_BODY = "full_body"

class EquipmentEnum(enum.Enum):
    BODYWEIGHT = "bodyweight"
    DUMBBELLS = "dumbbells"
    BARBELL = "barbell"
    RESISTANCE_BANDS = "resistance_bands"
    KETTLEBELL = "kettlebell"
    PULL_UP_BAR = "pull_up_bar"
    BENCH = "bench"
    CABLE_MACHINE = "cable_machine"
    TREADMILL = "treadmill"
    BIKE = "bike"
    YOGA_MAT = "yoga_mat"
    NONE = "none"

class DifficultyEnum(enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ExerciseTypeEnum(enum.Enum):
    STRENGTH = "strength"
    CARDIO = "cardio"
    FLEXIBILITY = "flexibility"
    BALANCE = "balance"
    PLYOMETRIC = "plyometric"

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    
    # Categorization
    muscle_group = Column(Enum(MuscleGroupEnum), nullable=False, index=True)
    secondary_muscles = Column(Text, nullable=True)  # JSON string of additional muscle groups
    exercise_type = Column(Enum(ExerciseTypeEnum), nullable=False)
    
    # Equipment & Difficulty
    equipment_needed = Column(Enum(EquipmentEnum), nullable=False, index=True)
    difficulty_level = Column(Enum(DifficultyEnum), nullable=False, index=True)
    
    # Exercise Metrics
    calories_per_minute = Column(Float, nullable=True)
    is_compound = Column(Boolean, default=False)  # Compound vs isolation exercise
    
    # Media & Resources
    video_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    tags = Column(Text, nullable=True)  # JSON string for additional tags
    
    # Default sets/reps (can be overridden in workout plans)
    default_sets = Column(Integer, default=3)
    default_reps_min = Column(Integer, nullable=True)
    default_reps_max = Column(Integer, nullable=True)
    default_duration_seconds = Column(Integer, nullable=True)  # For time-based exercises
    default_rest_seconds = Column(Integer, default=60)

    def __repr__(self):
        return f"<Exercise(name='{self.name}', muscle_group='{self.muscle_group}')>" 