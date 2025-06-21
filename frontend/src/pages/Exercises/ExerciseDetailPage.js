import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiClock, FiTarget } from 'react-icons/fi';

const ExerciseDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/exercises" className="btn btn-secondary">
          <FiArrowLeft />
          Back to Exercises
        </Link>
        <h1>Exercise Details</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Exercise #{id}</h2>
          <p className="text-muted">Detailed exercise information coming soon!</p>
        </div>

        <div className="exercise-placeholder">
          <div className="exercise-icon">
            <FiPlay size={48} />
          </div>
          <h3>Exercise Content</h3>
          <p>
            This page will show detailed exercise instructions, videos, 
            muscle groups, difficulty levels, and more.
          </p>
          
          <div className="exercise-stats">
            <div className="stat">
              <FiClock />
              <span>Duration</span>
            </div>
            <div className="stat">
              <FiTarget />
              <span>Difficulty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage; 