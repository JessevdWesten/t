import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiPlus,
  FiTrash2,
  FiSave,
  FiPlay,
  FiClock,
  FiTarget,
  FiHome,
  FiArrowLeft,
  FiEdit3,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiCopy,
  FiShare2
} from 'react-icons/fi';

const WorkoutBuilderPage = () => {
  const { user } = useAuth();
  const [workoutName, setWorkoutName] = useState('My Custom Workout');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalDuration, setTotalDuration] = useState(0);
  const [workoutSaved, setWorkoutSaved] = useState(false);

  // Sample exercises (same as ExercisesPage)
  const sampleExercises = [
    {
      id: 1,
      name: "Push-ups",
      description: "Upper body compound movement",
      muscle_groups: ["chest", "shoulders", "triceps"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 10,
      calories_per_set: 8
    },
    {
      id: 2,
      name: "Squats",
      description: "Lower body compound movement",
      muscle_groups: ["quadriceps", "glutes", "hamstrings"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 15,
      calories_per_set: 12
    },
    {
      id: 3,
      name: "Deadlifts",
      description: "Full body posterior chain exercise",
      muscle_groups: ["hamstrings", "glutes", "back"],
      difficulty_level: "intermediate",
      equipment_needed: "Barbell",
      duration_minutes: 20,
      calories_per_set: 15
    },
    {
      id: 4,
      name: "Pull-ups",
      description: "Upper body pulling exercise",
      muscle_groups: ["back", "biceps"],
      difficulty_level: "intermediate",
      equipment_needed: "Pull-up bar",
      duration_minutes: 12,
      calories_per_set: 10
    },
    {
      id: 5,
      name: "Planks",
      description: "Core stability exercise",
      muscle_groups: ["core", "abs"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 8,
      calories_per_set: 6
    },
    {
      id: 6,
      name: "Burpees",
      description: "Full body cardio exercise",
      muscle_groups: ["full_body"],
      difficulty_level: "advanced",
      equipment_needed: "None",
      duration_minutes: 10,
      calories_per_set: 20
    },
    {
      id: 7,
      name: "Lunges",
      description: "Single leg strength exercise",
      muscle_groups: ["quadriceps", "glutes"],
      difficulty_level: "beginner",
      equipment_needed: "None",
      duration_minutes: 12,
      calories_per_set: 9
    },
    {
      id: 8,
      name: "Mountain Climbers",
      description: "High intensity cardio movement",
      muscle_groups: ["core", "shoulders"],
      difficulty_level: "intermediate",
      equipment_needed: "None",
      duration_minutes: 8,
      calories_per_set: 12
    }
  ];

  useEffect(() => {
    setAvailableExercises(sampleExercises);
  }, []);

  useEffect(() => {
    // Calculate total duration
    const total = selectedExercises.reduce((sum, exercise) => {
      return sum + (exercise.duration_minutes * exercise.sets);
    }, 0);
    setTotalDuration(total);
  }, [selectedExercises]);

  const addExercise = (exercise) => {
    const workoutExercise = {
      ...exercise,
      workoutId: Date.now(),
      sets: 3,
      reps: 12,
      weight: 0,
      restSeconds: 60
    };
    setSelectedExercises(prev => [...prev, workoutExercise]);
    toast.success(`Added ${exercise.name} to workout! 💪`);
  };

  const removeExercise = (workoutId) => {
    setSelectedExercises(prev => prev.filter(ex => ex.workoutId !== workoutId));
    toast.success('Exercise removed from workout');
  };

  const updateExercise = (workoutId, field, value) => {
    setSelectedExercises(prev => prev.map(exercise => 
      exercise.workoutId === workoutId 
        ? { ...exercise, [field]: value }
        : exercise
    ));
  };

  const saveWorkout = () => {
    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise to your workout');
      return;
    }

    const workout = {
      id: Date.now(),
      name: workoutName,
      description: workoutDescription,
      exercises: selectedExercises,
      totalDuration,
      createdAt: new Date().toISOString(),
      createdBy: user.email
    };

    // Save to localStorage (would be API call in real app)
    const savedWorkouts = JSON.parse(localStorage.getItem('customWorkouts') || '[]');
    savedWorkouts.push(workout);
    localStorage.setItem('customWorkouts', JSON.stringify(savedWorkouts));

    setWorkoutSaved(true);
    toast.success('Workout saved successfully! 🎉');
  };

  const startWorkout = () => {
    if (selectedExercises.length === 0) {
      toast.error('Please add exercises to start the workout');
      return;
    }
    toast.success('Starting workout! Track your progress as you go 🚀');
    // Would navigate to workout tracking page
  };

  const filteredExercises = availableExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
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
        <p>You need to be logged in to build workouts.</p>
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
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
              <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🏗️ Workout Builder</h1>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                Create your custom workout routine
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

        {/* Main Content */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Left Side - Exercise Library */}
          <div>
            <h2 style={{ marginBottom: '1rem' }}>📚 Exercise Library</h2>
            
            {/* Search and Filter */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                position: 'relative', 
                flex: '1',
                minWidth: '200px'
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
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  minWidth: '120px'
                }}
              >
                <option value="all">All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Available Exercises */}
            <div style={{ 
              maxHeight: '600px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => addExercise(exercise)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <h4 style={{ margin: 0 }}>{exercise.name}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        background: getDifficultyColor(exercise.difficulty_level),
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {exercise.difficulty_level}
                      </span>
                      <button style={{
                        background: 'rgba(16, 185, 129, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                    {exercise.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    opacity: 0.9
                  }}>
                    <span><FiClock size={12} /> {exercise.duration_minutes}min</span>
                    <span><FiTarget size={12} /> {exercise.equipment_needed}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Workout Builder */}
          <div>
            {/* Workout Header */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                {isEditingName ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <input
                      type="text"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        flex: 1
                      }}
                    />
                    <button 
                      onClick={() => setIsEditingName(false)}
                      style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <FiCheck size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ margin: 0 }}>{workoutName}</h2>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <FiEdit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <textarea
                placeholder="Add a description for your workout..."
                value={workoutDescription}
                onChange={(e) => setWorkoutDescription(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                  resize: 'vertical',
                  minHeight: '60px',
                  marginBottom: '1rem'
                }}
              />

              {/* Workout Stats */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {selectedExercises.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Exercises</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {totalDuration}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Minutes</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {selectedExercises.reduce((sum, ex) => sum + ex.sets, 0)}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Sets</div>
                </div>
              </div>
            </div>

            {/* Selected Exercises */}
            <h3 style={{ marginBottom: '1rem' }}>🎯 Your Workout ({selectedExercises.length} exercises)</h3>
            
            <div style={{ 
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {selectedExercises.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  opacity: 0.7
                }}>
                  <p>No exercises added yet</p>
                  <p style={{ fontSize: '0.9rem' }}>Click exercises from the library to add them</p>
                </div>
              ) : (
                selectedExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.workoutId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ 
                      background: 'rgba(255,255,255,0.15)', 
                      padding: '1rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <h4 style={{ margin: 0 }}>{exercise.name}</h4>
                      <button 
                        onClick={() => removeExercise(exercise.workoutId)}
                        style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '0.25rem',
                          padding: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    
                    {/* Exercise Parameters */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Sets</label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.workoutId, 'sets', parseInt(e.target.value) || 1)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Reps</label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.workoutId, 'reps', parseInt(e.target.value) || 1)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Weight (lbs)</label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(exercise.workoutId, 'weight', parseInt(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Rest (sec)</label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.restSeconds}
                          onChange={(e) => updateExercise(exercise.workoutId, 'restSeconds', parseInt(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.25rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={saveWorkout}
                disabled={selectedExercises.length === 0}
                style={{ 
                  background: selectedExercises.length === 0 ? 'rgba(107, 114, 128, 0.5)' : 'rgba(59, 130, 246, 0.8)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  cursor: selectedExercises.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                <FiSave /> {workoutSaved ? 'Saved!' : 'Save Workout'}
              </button>
              
              <button 
                onClick={startWorkout}
                disabled={selectedExercises.length === 0}
                style={{ 
                  background: selectedExercises.length === 0 ? 'rgba(107, 114, 128, 0.5)' : 'rgba(16, 185, 129, 0.8)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  cursor: selectedExercises.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                <FiPlay /> Start Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilderPage; 