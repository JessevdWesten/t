import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiUser,
  FiArrowRight,
  FiGithub,
  FiChrome,
  FiCheck,
  FiX
} from 'react-icons/fi';
import './AuthPages.css';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm();

  const watchPassword = watch('password', '');

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return null;
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    const length = password.length >= 8;
    
    const score = [hasLower, hasUpper, hasNumbers, hasNonalphas, length].filter(Boolean).length;
    
    if (score < 2) return { strength: 'weak', color: '#ef4444', text: 'Weak' };
    if (score < 4) return { strength: 'medium', color: '#f59e0b', text: 'Medium' };
    return { strength: 'strong', color: '#10b981', text: 'Strong' };
  };

  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(watchPassword));
  }, [watchPassword]);

  const onSubmit = async (data) => {
    console.log('🔧 RegisterPage: Form submitted with data:', data);
    
    try {
      // Validate password match
      if (data.password !== data.confirmPassword) {
        console.log('❌ RegisterPage: Passwords do not match');
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match'
        });
        return;
      }

      console.log('🔧 RegisterPage: Starting registration process...');
      setIsLoading(true);
      
      const registrationData = {
        email: data.email,
        password: data.password,
        full_name: data.fullName
      };
      
      console.log('🔧 RegisterPage: Calling registerUser with:', registrationData);
      const result = await registerUser(registrationData);
      console.log('🔧 RegisterPage: Registration result:', result);

      if (result.success) {
        console.log('✅ RegisterPage: Registration successful, redirecting to dashboard');
        // Redirect to dashboard using hash routing
        window.location.hash = '#dashboard';
      } else {
        console.log('❌ RegisterPage: Registration failed:', result.error);
        setError('email', {
          type: 'manual',
          message: result.error || 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('❌ RegisterPage: Unexpected error during registration:', error);
      setError('email', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission with additional debugging
  const handleFormSubmit = (e) => {
    console.log('🔧 RegisterPage: Form submit event triggered');
    e.preventDefault();
    handleSubmit(onSubmit)(e);
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
            
            <h1>Start Your Journey!</h1>
            <p>
              Join thousands of fitness enthusiasts who are already transforming 
              their lives with our AI-powered platform. Your best self is just one 
              click away!
            </p>

            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Personalized Goals</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Coaching</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Community Support</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div 
          className="auth-form-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="auth-form" variants={itemVariants}>
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Start your fitness transformation today</p>
            </div>

            {/* Social Login Options */}
            <motion.div className="social-login" variants={itemVariants}>
              <button className="social-btn google">
                <FiChrome />
                <span>Sign up with Google</span>
              </button>
              <button className="social-btn github">
                <FiGithub />
                <span>Sign up with GitHub</span>
              </button>
            </motion.div>

            <motion.div className="divider" variants={itemVariants}>
              <span>or create account with email</span>
            </motion.div>

            <motion.form onSubmit={handleFormSubmit} variants={itemVariants}>
              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'error' : ''}
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>
                {errors.fullName && (
                  <span className="error-message">{errors.fullName.message}</span>
                )}
              </div>

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
                    placeholder="Create a strong password"
                    className={errors.password ? 'error' : ''}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
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
                
                {/* Password Strength Indicator */}
                {passwordStrength && watchPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: passwordStrength.strength === 'weak' ? '33%' : 
                                 passwordStrength.strength === 'medium' ? '66%' : '100%',
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <span 
                      className="strength-text"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
                
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password'
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword.message}</span>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    {...register('terms', {
                      required: 'You must agree to the terms and conditions'
                    })}
                  />
                  <span className="checkbox-custom"></span>
                  I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                </label>
                {errors.terms && (
                  <span className="error-message">{errors.terms.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  console.log('🔧 RegisterPage: Submit button clicked');
                  // Let the form handle the submission
                }}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Sign In Link */}
            <motion.div className="auth-footer" variants={itemVariants}>
              <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                Already have an account?{' '}
                <button 
                  onClick={() => window.location.hash = '#login'}
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
                  Sign in here
                </button>
              </p>
              
              {/* Debug Link */}
              <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                Having registration issues?{' '}
                <button 
                  onClick={() => window.location.hash = '#test-registration'}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#f59e0b', 
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    font: 'inherit',
                    fontSize: '0.9rem'
                  }}
                >
                  🧪 Test Registration
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

export default RegisterPage; 