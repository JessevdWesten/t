import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FiHome,
  FiActivity,
  FiBook,
  FiCalendar,
  FiBarChart2,
  FiAward,
  FiUsers,
  FiBell,
  FiUser,
  FiSettings,
  FiChevronLeft
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: <FiHome />,
      label: 'Dashboard',
      description: 'Overview & Stats'
    },
    {
      path: '/exercises',
      icon: <FiActivity />,
      label: 'Exercises',
      description: 'Workout Library'
    },
    {
      path: '/recipes',
      icon: <FiBook />,
      label: 'Nutrition',
      description: 'Recipes & Meals'
    },
    {
      path: '/plans',
      icon: <FiCalendar />,
      label: 'Plans',
      description: 'Workout & Meal Plans'
    },
    {
      path: '/analytics',
      icon: <FiBarChart2 />,
      label: 'Analytics',
      description: 'Progress Tracking'
    },
    {
      path: '/achievements',
      icon: <FiAward />,
      label: 'Achievements',
      description: 'Badges & Rewards'
    },
    {
      path: '/social',
      icon: <FiUsers />,
      label: 'Social',
      description: 'Friends & Community'
    },
    {
      path: '/notifications',
      icon: <FiBell />,
      label: 'Notifications',
      description: 'Alerts & Reminders'
    }
  ];

  const bottomMenuItems = [
    {
      path: '/profile',
      icon: <FiUser />,
      label: 'Profile',
      description: 'Account Settings'
    },
    {
      path: '/settings',
      icon: <FiSettings />,
      label: 'Settings',
      description: 'App Preferences'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!sidebarCollapsed && (
            <>
              <span className="logo-icon">🏋️</span>
              <span className="logo-text">FitGenius</span>
            </>
          )}
        </div>
        
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FiChevronLeft className={sidebarCollapsed ? 'rotated' : ''} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                  {isActiveRoute(item.path) && <div className="active-indicator" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section nav-bottom">
          <ul className="nav-list">
            {bottomMenuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                  {isActiveRoute(item.path) && <div className="active-indicator" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {!sidebarCollapsed && (
        <div className="sidebar-footer">
          <div className="upgrade-card">
            <div className="upgrade-icon">⭐</div>
            <h4>Upgrade to Pro</h4>
            <p>Unlock premium features and get personalized AI coaching</p>
            <button className="btn btn-primary btn-sm">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 