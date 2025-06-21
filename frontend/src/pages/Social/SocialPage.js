import React from 'react';
import { FiUsers, FiHeart } from 'react-icons/fi';

const SocialPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Social & Community</h1>
        <p>Connect with fellow fitness enthusiasts</p>
      </div>

      <div className="card">
        <div className="card-header">
          <FiUsers size={32} />
          <div>
            <h2>Social Features</h2>
            <p className="text-muted">Community platform coming soon!</p>
          </div>
        </div>

        <div className="social-placeholder">
          <div className="social-icon">
            <FiHeart size={48} />
          </div>
          <h3>Social Platform</h3>
          <p>
            This page will feature your friend feed, workout sharing, 
            community challenges, and motivational interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialPage; 