import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiPlay, 
  FiPause,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiHome,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiCheck,
  FiStar,
  FiHeart,
  FiShare2,
  FiBookmark
} from 'react-icons/fi';

const ExerciseDetailPage = () => {
  const { user } = useAuth();
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [sets, setSets] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get exercise ID from URL hash (for demo, we'll use a mock exercise)
  const exerciseId = window.location.hash.split('/')[1] || '1';

  // Mock exercise data (would come from API)
  const exerciseData = {
    id: 1,
    name: "Push-ups",
    description: "A classic upper body exercise that targets the chest, shoulders, and triceps while engaging the core for stability.",
    difficulty_level: "beginner",
    muscle_groups: ["chest", "shoulders", "triceps", "core"],
    equipment_needed: "None",
    duration_minutes: 15,
    calories_per_set: 8,
    instructions: [
      "Start in a plank position with hands placed slightly wider than shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your chest toward the ground by bending your elbows",
      "Push through your palms to return to the starting position",
      "Maintain core engagement throughout the movement"
    ],
    tips: [
      "Keep your core tight to prevent sagging hips",
      "Focus on controlled movement rather than speed",
      "Breathe out as you push up, breathe in as you lower down",
      "Start with knee push-ups if full push-ups are too difficult"
    ],
    variations: [
      { name: "Knee Push-ups", difficulty: "easier", description: "Perform on knees instead of toes" },
      { name: "Incline Push-ups", difficulty: "easier", description: "Hands elevated on a bench or step" },
      { name: "Diamond Push-ups", difficulty: "harder", description: "Hands form a diamond shape" },
      { name: "One-arm Push-ups", difficulty: "advanced", description: "Single arm variation" }
    ],
    common_mistakes: [
      "Letting hips sag or pike up",
      "Not going through full range of motion",
      "Placing hands too wide or too narrow",
      "Holding breath during the movement"
    ]
  };

  useEffect(() => {
    setCurrentExercise(exerciseData);
    // Initialize with 3 empty sets
    setSets([
      { id: 1, reps: 0, weight: 0, completed: false },
      { id: 2, reps: 0, weight: 0, completed: false },
      { id: 3, reps: 0, weight: 0, completed: false }
    ]);
  }, [exerciseId]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
      toast.success('Rest time complete! 💪');
      setTimerSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const startTimer = (seconds = 60) => {
    setTimerSeconds(seconds);
    setIsTimerActive(true);
  };

  const updateSet = (setId, field, value) => {
    setSets(prev => prev.map(set => 
      set.id === setId ? { ...set, [field]: value } : set
    ));
  };

  const addSet = () => {
    const newSet = { 
      id: Date.now(), 
      reps: 0, 
      weight: 0, 
      completed: false 
    };
    setSets(prev => [...prev, newSet]);
  };

  const completeSet = (setId) => {
    setSets(prev => prev.map(set => 
      set.id === setId ? { ...set, completed: true } : set
    ));
    toast.success('Set completed! 🎯');
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': case 'easier': return '#10b981';
      case 'intermediate': case 'harder': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <p>You need to be logged in to view exercise details.</p>
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

  if (!currentExercise) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '1rem' }}>Loading exercise...</p>
        </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => window.location.hash = '#exercises'}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiArrowLeft /> Back to Exercises
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{currentExercise.name}</h1>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginTop: '0.5rem',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  background: getDifficultyColor(currentExercise.difficulty_level),
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {currentExercise.difficulty_level}
                </span>
                <span style={{ opacity: 0.9 }}>
                  <FiClock size={16} style={{ marginRight: '0.25rem' }} />
                  {currentExercise.duration_minutes} min
                </span>
                <span style={{ opacity: 0.9 }}>
                  <FiTarget size={16} style={{ marginRight: '0.25rem' }} />
                  {currentExercise.equipment_needed}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setIsLiked(!isLiked);
                toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites! ❤️');
              }}
              style={{ 
                background: isLiked ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiHeart /> {isLiked ? 'Liked' : 'Like'}
            </button>
            <button 
              onClick={() => {
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? 'Removed from saved' : 'Saved for later! 📚');
              }}
              style={{ 
                background: isBookmarked ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiBookmark /> {isBookmarked ? 'Saved' : 'Save'}
            </button>
            <button 
              style={{ 
                background: 'rgba(16, 185, 129, 0.8)', 
                color: 'white', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiShare2 /> Share
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Left Column - Exercise Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Exercise Video/Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2rem', 
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ 
                fontSize: '4rem',
                marginBottom: '1rem',
                opacity: 0.7
              }}>
                🎥
              </div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Exercise Demonstration</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Video tutorial coming soon</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiPlay /> Watch Tutorial
              </button>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2rem', 
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 style={{ marginTop: 0 }}>About This Exercise</h2>
              <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {currentExercise.description}
              </p>
              
              {/* Muscle Groups */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Target Muscle Groups</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {currentExercise.muscle_groups.map((muscle, index) => (
                    <span key={index} style={{ 
                      padding: '0.5rem 1rem',
                      background: 'rgba(16, 185, 129, 0.8)',
                      borderRadius: '1rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      💪 {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                    {currentExercise.calories_per_set}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Calories per set</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {currentExercise.duration_minutes}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Minutes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {currentExercise.muscle_groups.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Muscle groups</div>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '2rem', 
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 style={{ marginTop: 0 }}>Step-by-Step Instructions</h2>
              <ol style={{ paddingLeft: '1.5rem' }}>
                {currentExercise.instructions.map((instruction, index) => (
                  <li key={index} style={{ 
                    marginBottom: '1rem',
                    lineHeight: '1.6'
                  }}>
                    {instruction}
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          {/* Right Column - Workout Tracker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Timer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '1.5rem', 
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}
            >
              <h3 style={{ marginTop: 0 }}>Rest Timer</h3>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: isTimerActive ? '#f59e0b' : '#10b981'
              }}>
                {formatTime(timerSeconds)}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                <button 
                  onClick={() => startTimer(30)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  30s
                </button>
                <button 
                  onClick={() => startTimer(60)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  1m
                </button>
                <button 
                  onClick={() => startTimer(90)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    padding: '0.5rem 1rem', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  1.5m
                </button>
              </div>
              <button 
                onClick={() => setIsTimerActive(!isTimerActive)}
                style={{ 
                  background: isTimerActive ? '#ef4444' : '#10b981', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                {isTimerActive ? <FiPause /> : <FiPlay />}
                {isTimerActive ? 'Pause' : 'Start'}
              </button>
            </motion.div>

            {/* Set Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '1.5rem', 
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: 0 }}>Track Your Sets</h3>
                <button 
                  onClick={addSet}
                  style={{ 
                    background: 'rgba(16, 185, 129, 0.8)', 
                    color: 'white', 
                    padding: '0.5rem', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FiPlus size={16} />
                </button>
              </div>

              {sets.map((set, index) => (
                <div key={set.id} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: set.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ minWidth: '30px', fontWeight: 'bold' }}>
                    {index + 1}
                  </span>
                  <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value) || 0)}
                    disabled={set.completed}
                    style={{
                      width: '60px',
                      padding: '0.5rem',
                      border: 'none',
                      borderRadius: '0.25rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>reps</span>
                  {!set.completed ? (
                    <button 
                      onClick={() => completeSet(set.id)}
                      style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '0.5rem', 
                        border: 'none', 
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        marginLeft: 'auto'
                      }}
                    >
                      <FiCheck size={14} />
                    </button>
                  ) : (
                    <span style={{ 
                      color: '#10b981',
                      marginLeft: 'auto',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      ✓ Done
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem'
        }}>
          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>💡 Pro Tips</h3>
            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {currentExercise.tips.map((tip, index) => (
                <li key={index} style={{ 
                  marginBottom: '0.75rem',
                  lineHeight: '1.5'
                }}>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Variations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🔄 Variations</h3>
            {currentExercise.variations.map((variation, index) => (
              <div key={index} style={{ 
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '0.5rem'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h4 style={{ margin: 0 }}>{variation.name}</h4>
                  <span style={{ 
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    background: getDifficultyColor(variation.difficulty),
                    fontSize: '0.8rem'
                  }}>
                    {variation.difficulty}
                  </span>
                </div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                  {variation.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Common Mistakes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>⚠️ Common Mistakes</h3>
            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {currentExercise.common_mistakes.map((mistake, index) => (
                <li key={index} style={{ 
                  marginBottom: '0.75rem',
                  lineHeight: '1.5',
                  color: '#fca5a5'
                }}>
                  {mistake}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage; 