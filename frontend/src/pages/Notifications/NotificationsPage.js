import React from 'react';
import { FiBell, FiMessageCircle } from 'react-icons/fi';

const NotificationsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notifications & Alerts</h1>
        <p>Stay updated with your fitness journey</p>
      </div>

      <div className="card">
        <div className="card-header">
          <FiBell size={32} />
          <div>
            <h2>Notification Center</h2>
            <p className="text-muted">Smart notifications coming soon!</p>
          </div>
        </div>

        <div className="notifications-placeholder">
          <div className="notifications-icon">
            <FiMessageCircle size={48} />
          </div>
          <h3>Smart Notifications</h3>
          <p>
            This page will show workout reminders, achievement alerts, 
            nutrition notifications, and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 