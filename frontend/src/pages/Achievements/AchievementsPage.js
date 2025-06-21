import React from 'react';
import { FiAward, FiStar } from 'react-icons/fi';

const AchievementsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Achievements & Badges</h1>
        <p>Celebrate your fitness milestones</p>
      </div>

      <div className="card">
        <div className="card-header">
          <FiAward size={32} />
          <div>
            <h2>Your Achievements</h2>
            <p className="text-muted">Gamification system coming soon!</p>
          </div>
        </div>

        <div className="achievements-placeholder">
          <div className="achievements-icon">
            <FiStar size={48} />
          </div>
          <h3>Achievement System</h3>
          <p>
            This page will show your badges, streaks, challenges, 
            leaderboards, and milestone rewards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage; 