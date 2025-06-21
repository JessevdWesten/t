import React from 'react';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OnboardingPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to FitGenius!</h1>
        <p>Let's set up your personalized fitness experience</p>
      </div>

      <div className="card">
        <div className="card-header">
          <FiCheckCircle size={32} />
          <div>
            <h2>Complete Your Profile</h2>
            <p className="text-muted">Onboarding wizard coming soon!</p>
          </div>
        </div>

        <div className="onboarding-placeholder">
          <div className="onboarding-icon">
            <FiCheckCircle size={48} />
          </div>
          <h3>Profile Setup</h3>
          <p>
            This page will guide you through setting up your fitness goals, 
            preferences, experience level, and personal information.
          </p>
          
          <Link to="/dashboard" className="btn btn-primary">
            Skip to Dashboard
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage; 