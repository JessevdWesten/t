import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { exerciseAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  FiSearch, 
  FiFilter, 
  FiPlay,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiHome,
  FiUser
} from 'react-icons/fi';

const ExercisesPage = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample exercises data (will be replaced by API call)
  const sampleExercises = [
    {
      id: 1,
      name: "Push-ups",
      description: "A classic upper body exercise targeting chest, shoulders, and triceps",
      muscle_groups: ["chest", "shoulders", "triceps"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 10
    },
    {
      id: 2,
      name: "Squats",
      description: "Lower body compound movement for legs and glutes",
      muscle_groups: ["quadriceps", "glutes", "hamstrings"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 15
    },
    {
      id: 3,
      name: "Deadlifts",
      description: "Full body compound exercise focusing on posterior chain",
      muscle_groups: ["hamstrings", "glutes", "back"],
      difficulty_level: "intermediate",
      equipment_needed: "Barbell",
      duration_minutes: 20
    },
    {
      id: 4,
      name: "Pull-ups",
      description: "Upper body pulling exercise for back and biceps",
      muscle_groups: ["back", "biceps"],
      difficulty_level: "intermediate",
      equipment_needed: "Pull-up bar",
      duration_minutes: 12
    },
    {
      id: 5,
      name: "Planks",
      description: "Core stability exercise for abs and lower back",
      muscle_groups: ["core", "abs"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 8
    },
    {
      id: 6,
      name: "Bench Press",
      description: "Upper body pressing movement for chest development",
      muscle_groups: ["chest", "shoulders", "triceps"],
      difficulty_level: "advanced",
      equipment_needed: "Barbell, Bench",
      duration_minutes: 25
    }
  ];

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      try {
        const response = await exerciseAPI.getAll();
        setExercises(response.data || []);
      } catch (apiError) {
        // Fallback to sample data if API fails
        console.log('API not available, using sample data');
        setExercises(sampleExercises);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      setExercises(sampleExercises);
      toast.error('Using sample data - API connection pending');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           exercise.difficulty_level === selectedCategory ||
                           (exercise.muscle_groups && exercise.muscle_groups.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!user) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1>🔐 Please Log In</h1>
        <p>You need to be logged in to access exercises.</p>
        <button 
          onClick={() => window.location.hash = '#login'}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            padding: '1rem 2rem', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            marginTop: '1rem'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>💪 Exercise Library</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Discover and track your workouts
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.hash = '#workout-builder'}
              style={{ 
                background: 'rgba(16, 185, 129, 0.8)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              🏗️ Build Custom Workout
            </button>
            <button 
              onClick={() => window.location.hash = '#workout-history'}
              style={{ 
                background: 'rgba(139, 92, 246, 0.8)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              📈 View History
            </button>
            <button 
              onClick={() => window.location.hash = '#dashboard'}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiHome /> Dashboard
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            position: 'relative', 
            flex: '1',
            minWidth: '250px'
          }}>
            <FiSearch style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            <option value="all">All Categories</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="core">Core</option>
          </select>
        </div>

        {/* Exercise Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ 
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem' }}>Loading exercises...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => window.location.hash = `#exercise/${exercise.id}`}
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '1.5rem', 
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                whileHover={{ scale: 1.02 }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{exercise.name}</h3>
                  <div style={{ 
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    background: getDifficultyColor(exercise.difficulty_level),
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {exercise.difficulty_level}
                  </div>
                </div>
                
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  opacity: 0.9,
                  lineHeight: '1.5'
                }}>
                  {exercise.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {exercise.muscle_groups && exercise.muscle_groups.map((muscle, i) => (
                    <span key={i} style={{ 
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem'
                    }}>
                      {muscle}
                    </span>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiClock />
                    <span>{exercise.duration_minutes || 15} min</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiTarget />
                    <span>{exercise.equipment_needed || 'None'}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    window.location.hash = `#exercise/${exercise.id}`;
                  }}
                  style={{ 
                    width: '100%',
                    background: 'rgba(16, 185, 129, 0.8)', 
                    color: 'white', 
                    padding: '0.75rem', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(16, 185, 129, 1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(16, 185, 129, 0.8)';
                  }}
                >
                  <FiPlay /> Start Exercise
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {filteredExercises.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h3>No exercises found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage; 