import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FitGenius</h3>
            <p>Your AI-powered fitness companion</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="#" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#" aria-label="Email">
                <FiMail />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><Link to="/exercises">Exercises</Link></li>
              <li><Link to="/recipes">Nutrition</Link></li>
              <li><Link to="/plans">Workout Plans</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><Link to="/social">Social</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/notifications">Notifications</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            Made with <FiHeart className="heart" /> by FitGenius Team © 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 