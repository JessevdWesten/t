import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiTrendingUp, 
  FiActivity,
  FiTarget,
  FiCalendar,
  FiHome,
  FiAward,
  FiHeart,
  FiZap
} from 'react-icons/fi';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);

  // Sample analytics data
  const analyticsData = {
    summary: {
      totalWorkouts: 24,
      totalMinutes: 480,
      caloriesBurned: 3200,
      avgHeartRate: 145,
      personalRecords: 8,
      streakDays: 12
    },
    weeklyProgress: [
      { day: 'Mon', workouts: 1, calories: 350, duration: 45 },
      { day: 'Tue', workouts: 1, calories: 420, duration: 60 },
      { day: 'Wed', workouts: 0, calories: 0, duration: 0 },
      { day: 'Thu', workouts: 2, calories: 520, duration: 75 },
      { day: 'Fri', workouts: 1, calories: 380, duration: 50 },
      { day: 'Sat', workouts: 1, calories: 450, duration: 65 },
      { day: 'Sun', workouts: 1, calories: 320, duration: 40 }
    ],
    goals: [
      { name: 'Weekly Workouts', current: 6, target: 5, unit: 'sessions', completed: true },
      { name: 'Calories Burned', current: 2440, target: 2500, unit: 'cal', completed: false },
      { name: 'Active Minutes', current: 335, target: 300, unit: 'min', completed: true },
      { name: 'Weight Goal', current: 75, target: 70, unit: 'kg', completed: false }
    ],
    bodyMetrics: [
      { metric: 'Weight', current: 75, previous: 78, unit: 'kg', trend: 'down' },
      { metric: 'Body Fat', current: 18, previous: 22, unit: '%', trend: 'down' },
      { metric: 'Muscle Mass', current: 62, previous: 60, unit: 'kg', trend: 'up' },
      { metric: 'BMI', current: 22.5, previous: 23.4, unit: '', trend: 'down' }
    ]
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
        <p>You need to be logged in to view analytics.</p>
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
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>📊 Analytics Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Track your fitness progress and achievements
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '0.75rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem'
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
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

        {/* Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <FiActivity style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#10b981' }} />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Total Workouts</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              {analyticsData.summary.totalWorkouts}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <FiZap style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f59e0b' }} />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Calories Burned</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              {analyticsData.summary.caloriesBurned.toLocaleString()}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <FiCalendar style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#3b82f6' }} />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Active Minutes</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              {analyticsData.summary.totalMinutes}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}
          >
            <FiAward style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ef4444' }} />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Current Streak</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              {analyticsData.summary.streakDays} days
            </p>
          </motion.div>
        </div>

        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '2rem', 
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem'
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>📈 Weekly Progress</h2>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            height: '200px',
            marginBottom: '1rem',
            padding: '0 1rem'
          }}>
            {analyticsData.weeklyProgress.map((day, index) => (
              <div key={day.day} style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  width: '40px',
                  height: `${Math.max(day.calories / 10, 20)}px`,
                  background: day.workouts > 0 ? '#10b981' : '#374151',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s ease'
                }} />
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{day.day}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{day.calories} cal</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals and Body Metrics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Goals Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>🎯 Goals Progress</h2>
            {analyticsData.goals.map((goal, index) => (
              <div key={goal.name} style={{ 
                marginBottom: '1.5rem',
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
                  <span style={{ fontWeight: 'bold' }}>{goal.name}</span>
                  <span style={{ 
                    color: goal.completed ? '#10b981' : '#f59e0b',
                    fontWeight: 'bold'
                  }}>
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div style={{ 
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                    height: '100%',
                    background: goal.completed ? '#10b981' : '#f59e0b',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Body Metrics Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>📏 Body Metrics</h2>
            {analyticsData.bodyMetrics.map((metric, index) => (
              <div key={metric.metric} style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {metric.metric}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {metric.current} {metric.unit}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    color: metric.trend === 'up' ? '#10b981' : '#ef4444',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {metric.trend === 'up' ? '↗️' : '↘️'}
                    {Math.abs(metric.current - metric.previous).toFixed(1)}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    from {metric.previous} {metric.unit}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '2rem', 
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>🏆 Recent Achievements</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ 
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
              <div style={{ fontWeight: 'bold' }}>First Pull-up</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>2 days ago</div>
            </div>
            <div style={{ 
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
              <div style={{ fontWeight: 'bold' }}>10-Day Streak</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>5 days ago</div>
            </div>
            <div style={{ 
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontWeight: 'bold' }}>5K Calories</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>1 week ago</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 