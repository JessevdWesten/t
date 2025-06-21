import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiActivity,
  FiTrendingUp,
  FiTarget,
  FiCalendar,
  FiAward,
  FiPlay,
  FiPlus,
  FiClock,
  FiUsers,
  FiArrowRight,
  FiZap
} from 'react-icons/fi';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Mock data - in real app this would come from API
  const stats = {
    workoutsThisWeek: 4,
    caloriesBurned: 1250,
    currentStreak: 12,
    weeklyGoal: 5
  };

  const recentWorkouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      duration: 45,
      calories: 320,
      date: '2024-01-15',
      type: 'strength'
    },
    {
      id: 2,
      name: 'Morning Cardio',
      duration: 30,
      calories: 280,
      date: '2024-01-14',
      type: 'cardio'
    },
    {
      id: 3,
      name: 'Leg Day',
      duration: 60,
      calories: 420,
      date: '2024-01-13',
      type: 'strength'
    }
  ];

  const quickActions = [
    {
      title: 'Start Workout',
      description: 'Begin your daily workout',
      icon: <FiPlay />,
      color: 'primary',
      path: '/exercises'
    },
    {
      title: 'Log Meal',
      description: 'Track your nutrition',
      icon: <FiPlus />,
      color: 'success',
      path: '/recipes'
    },
    {
      title: 'View Plans',
      description: 'Check your fitness plans',
      icon: <FiCalendar />,
      color: 'warning',
      path: '/plans'
    },
    {
      title: 'See Progress',
      description: 'View your analytics',
      icon: <FiTrendingUp />,
      color: 'info',
      path: '/analytics'
    }
  ];

  const achievements = [
    { name: '7-Day Streak', icon: '🔥', unlocked: true },
    { name: 'First Workout', icon: '💪', unlocked: true },
    { name: 'Nutrition Master', icon: '🥗', unlocked: false },
    { name: '30-Day Challenge', icon: '🏆', unlocked: false }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="dashboard-page">
      <motion.div 
        className="dashboard-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="header-content">
          <div className="welcome-section">
            <h1>{greeting}, {user?.full_name || user?.email?.split('@')[0] || 'there'}! 👋</h1>
            <p>Ready to crush your fitness goals today?</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">
                🔥
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.currentStreak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FiZap />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.workoutsThisWeek}/{stats.weeklyGoal}</span>
                <span className="stat-label">Weekly Goal</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="dashboard-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Quick Actions */}
        <motion.section className="quick-actions" variants={fadeInUp}>
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.path}
                className={`action-card ${action.color}`}
              >
                <div className="action-icon">
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <FiArrowRight className="action-arrow" />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Stats Overview */}
        <motion.section className="stats-overview" variants={fadeInUp}>
          <h2>This Week's Progress</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-header">
                <FiActivity className="stat-icon" />
                <span>Workouts</span>
              </div>
              <div className="stat-value">{stats.workoutsThisWeek}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${(stats.workoutsThisWeek / stats.weeklyGoal) * 100}%` }}
                />
              </div>
              <span className="stat-subtitle">of {stats.weeklyGoal} goal</span>
            </div>

            <div className="stat-item">
              <div className="stat-header">
                <FiZap className="stat-icon" />
                <span>Calories Burned</span>
              </div>
              <div className="stat-value">{stats.caloriesBurned.toLocaleString()}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: '75%' }}
                />
              </div>
              <span className="stat-subtitle">Great progress!</span>
            </div>

            <div className="stat-item">
              <div className="stat-header">
                <FiTarget className="stat-icon" />
                <span>Daily Streak</span>
              </div>
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="stat-subtitle">days in a row</span>
            </div>

            <div className="stat-item">
              <div className="stat-header">
                <FiUsers className="stat-icon" />
                <span>Social Rank</span>
              </div>
              <div className="stat-value">#15</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: '60%' }}
                />
              </div>
              <span className="stat-subtitle">among friends</span>
            </div>
          </div>
        </motion.section>

        <div className="dashboard-row">
          {/* Recent Workouts */}
          <motion.section className="recent-workouts" variants={fadeInUp}>
            <div className="section-header">
              <h2>Recent Workouts</h2>
              <Link to="/exercises" className="view-all-link">
                View All <FiArrowRight />
              </Link>
            </div>
            
            <div className="workouts-list">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="workout-item">
                  <div className="workout-type">
                    {workout.type === 'strength' ? '💪' : '🏃‍♂️'}
                  </div>
                  <div className="workout-details">
                    <h4>{workout.name}</h4>
                    <div className="workout-meta">
                      <span><FiClock /> {workout.duration}min</span>
                      <span>🔥 {workout.calories} cal</span>
                    </div>
                  </div>
                  <div className="workout-date">
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Achievements */}
          <motion.section className="achievements-section" variants={fadeInUp}>
            <div className="section-header">
              <h2>Achievements</h2>
              <Link to="/achievements" className="view-all-link">
                View All <FiArrowRight />
              </Link>
            </div>
            
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  <span className="achievement-name">{achievement.name}</span>
                  {achievement.unlocked && <FiAward className="unlock-indicator" />}
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Motivational Quote */}
        <motion.section className="motivation-card" variants={fadeInUp}>
          <div className="quote-content">
            <h3>"The only bad workout is the one that didn't happen."</h3>
            <p>Keep pushing forward - every step counts toward your goals!</p>
          </div>
          <div className="quote-action">
            <Link to="/exercises" className="btn btn-primary">
              Start Today's Workout
            </Link>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default DashboardPage; 