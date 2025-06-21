import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FiBell,
  FiSettings,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiSearch,
  FiChevronDown
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, toggleSidebar } = useTheme();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowUserDropdown(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setShowUserDropdown(false);
    navigate('/settings');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🏋️</span>
          <span className="logo-text">FitGenius</span>
        </Link>
      </div>

      <div className="navbar-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search exercises, recipes, plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button className="nav-button theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        {/* Notifications */}
        <div className="notification-wrapper">
          <button 
            className="nav-button notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                  View All
                </Link>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <div className="notification-icon">🏆</div>
                  <div className="notification-content">
                    <p>You've earned a new badge!</p>
                    <span className="notification-time">2 minutes ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">💪</div>
                  <div className="notification-content">
                    <p>Time for your workout reminder</p>
                    <span className="notification-time">10 minutes ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">🥗</div>
                  <div className="notification-content">
                    <p>New healthy recipe suggestion</p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="user-dropdown-wrapper">
          <button 
            className="user-profile-button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <div className="user-avatar">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user.full_name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.full_name || 'User'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <FiChevronDown className="dropdown-arrow" />
          </button>

          {showUserDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-avatar large">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt={user.full_name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h4>{user?.full_name || 'User'}</h4>
                  <p>{user?.email}</p>
                </div>
              </div>
              
              <div className="dropdown-menu">
                <button onClick={handleProfileClick} className="dropdown-item">
                  <FiUser />
                  <span>Profile</span>
                </button>
                <button onClick={handleSettingsClick} className="dropdown-item">
                  <FiSettings />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 