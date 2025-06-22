import React, { useState, useEffect } from 'react';

const WorkoutHistoryPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalTime: 0,
    totalCalories: 0,
    averageTime: 0
  });

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  const loadWorkoutHistory = () => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    if (savedWorkouts.length === 0) {
      const sampleWorkouts = [
        {
          id: 1,
          name: 'Push Day Workout',
          date: new Date('2024-01-20').toISOString(),
          duration: 75,
          exercises: [
            { name: 'Bench Press', sets: 4, reps: [12, 10, 8, 6], weight: [135, 155, 175, 185] },
            { name: 'Incline Dumbbell Press', sets: 3, reps: [12, 10, 8], weight: [60, 70, 80] }
          ],
          calories: 320,
          notes: 'Great session, felt strong on bench press!'
        },
        {
          id: 2,
          name: 'Pull Day Workout',
          date: new Date('2024-01-18').toISOString(),
          duration: 68,
          exercises: [
            { name: 'Pull-ups', sets: 4, reps: [8, 7, 6, 5], weight: [0, 0, 0, 0] },
            { name: 'Barbell Rows', sets: 4, reps: [12, 10, 8, 8], weight: [95, 115, 135, 135] }
          ],
          calories: 285,
          notes: 'Need to work on pull-up endurance'
        }
      ];
      
      localStorage.setItem('workoutHistory', JSON.stringify(sampleWorkouts));
      setWorkouts(sampleWorkouts);
      calculateStats(sampleWorkouts);
    } else {
      setWorkouts(savedWorkouts);
      calculateStats(savedWorkouts);
    }
  };

  const calculateStats = (workoutList) => {
    const totalWorkouts = workoutList.length;
    const totalTime = workoutList.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workoutList.reduce((sum, workout) => sum + workout.calories, 0);
    const averageTime = totalWorkouts > 0 ? Math.round(totalTime / totalWorkouts) : 0;

    setStats({
      totalWorkouts,
      totalTime,
      totalCalories,
      averageTime
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊 Workout History</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Track your fitness journey and progress</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Workouts', value: stats.totalWorkouts, icon: '🏋️' },
            { label: 'Total Time', value: formatDuration(stats.totalTime), icon: '⏱️' },
            { label: 'Total Calories', value: `${stats.totalCalories.toLocaleString()}`, icon: '🔥' },
            { label: 'Average Duration', value: formatDuration(stats.averageTime), icon: '📈' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '1.5rem',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {workouts.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '3rem',
              borderRadius: '1rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</div>
              <h3>No workouts found</h3>
              <p style={{ opacity: 0.8 }}>Start tracking your workouts to see your history here!</p>
              <button
                onClick={() => window.location.hash = '#workout-builder'}
                style={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '1rem 2rem',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  fontSize: '1rem'
                }}
              >
                Create Your First Workout
              </button>
            </div>
          ) : (
            workouts.map((workout, index) => (
              <div
                key={workout.id}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>{workout.name}</h3>
                    <p style={{ opacity: 0.8, margin: 0 }}>{formatDate(workout.date)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', textAlign: 'right' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {formatDuration(workout.duration)}
                      </div>
                      <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Duration</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {workout.calories} cal
                      </div>
                      <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Burned</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#60a5fa' }}>Exercises:</h4>
                  {workout.exercises.map((exercise, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>{exercise.name}</span>
                      <span style={{ opacity: 0.8, marginLeft: '1rem' }}>
                        {exercise.sets} sets
                      </span>
                    </div>
                  ))}
                </div>
                
                {workout.notes && (
                  <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#fbbf24' }}>Notes:</h4>
                    <p style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '1rem', 
                      borderRadius: '0.5rem',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      {workout.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '3rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => window.location.hash = '#exercises'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '1rem 2rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Back to Exercises
          </button>
          <button
            onClick={() => window.location.hash = '#workout-builder'}
            style={{
              background: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '1rem 2rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🏗️ Create New Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistoryPage; 