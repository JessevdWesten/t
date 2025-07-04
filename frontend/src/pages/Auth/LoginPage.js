import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiArrowRight,
  FiGithub,
  FiChrome
} from 'react-icons/fi';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    const result = await login({
      email: data.email,
      password: data.password
    });

    if (result.success) {
      // Redirect to dashboard using hash routing
      window.location.hash = '#dashboard';
    } else {
      setError('email', {
        type: 'manual',
        message: result.error
      });
    }
    
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <motion.div 
          className="auth-brand"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="brand-content">
            <a href="#" className="brand-logo">
              <span className="logo-icon">🏋️</span>
              <span className="logo-text">FitGenius</span>
            </a>
            
            <h1>Welcome Back!</h1>
            <p>
              Ready to continue your fitness journey? Sign in to access your 
              personalized workouts, nutrition plans, and track your amazing progress.
            </p>

            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">💪</span>
                <span>AI-Powered Workouts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🥗</span>
                <span>Smart Nutrition Plans</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Progress Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Achievement System</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="auth-form-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="auth-form" variants={itemVariants}>
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {/* Social Login Options */}
            <motion.div className="social-login" variants={itemVariants}>
              <button className="social-btn google">
                <FiChrome />
                <span>Continue with Google</span>
              </button>
              <button className="social-btn github">
                <FiGithub />
                <span>Continue with GitHub</span>
              </button>
            </motion.div>

            <motion.div className="divider" variants={itemVariants}>
              <span>or sign in with email</span>
            </motion.div>

            <motion.form onSubmit={handleSubmit(onSubmit)} variants={itemVariants}>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={errors.password ? 'error' : ''}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" {...register('remember')} />
                  <span className="checkbox-custom"></span>
                  Remember me
                </label>
                <a href="#forgot-password" className="forgot-link">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div className="auth-footer" variants={itemVariants}>
              <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                Don't have an account?{' '}
                <button 
                  onClick={() => window.location.hash = '#register'}
                  className="auth-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#667eea', 
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    font: 'inherit'
                  }}
                >
                  Sign up here
                </button>
              </p>
              
              <div className="help-links">
                <a href="#help">Need Help?</a>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="auth-background">
        <div className="bg-gradient"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 