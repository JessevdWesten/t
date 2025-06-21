import React from 'react';
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';

const AnalyticsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics & Progress</h1>
        <p>Track your fitness journey with detailed insights</p>
      </div>

      <div className="card">
        <div className="card-header">
          <FiBarChart2 size={32} />
          <div>
            <h2>Analytics Dashboard</h2>
            <p className="text-muted">Comprehensive progress tracking coming soon!</p>
          </div>
        </div>

        <div className="analytics-placeholder">
          <div className="analytics-icon">
            <FiTrendingUp size={48} />
          </div>
          <h3>Progress Analytics</h3>
          <p>
            This page will feature charts, graphs, progress tracking, 
            body composition analysis, and performance metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 