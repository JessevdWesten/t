import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fitnesstracker-backend-docker.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  console.log('🔧 AuthProvider: Component initializing...');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load - SIMPLIFIED FOR DEBUGGING
  useEffect(() => {
    console.log('🔧 AuthProvider: useEffect starting...');
    const initializeAuth = async () => {
      try {
        console.log('🔧 AuthProvider: Starting auth initialization...');
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        console.log('🔧 AuthProvider: Found token:', !!token, 'Found stored user:', !!storedUser);

        if (token && storedUser) {
          try {
            console.log('🔧 AuthProvider: Parsing stored user data...');
            // Parse stored user
            const userData = JSON.parse(storedUser);
            console.log('🔧 AuthProvider: Parsed user data successfully:', userData);
            setUser(userData);
          } catch (parseError) {
            console.error('❌ AuthProvider: Error parsing stored user:', parseError);
            // Clear invalid data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        } else {
          console.log('🔧 AuthProvider: No stored auth data found');
        }
      } catch (error) {
        console.error('❌ AuthProvider: Auth initialization error:', error);
      } finally {
        console.log('🔧 AuthProvider: Setting loading to false...');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('🔧 Registration: Starting registration with data:', { email: userData.email, full_name: userData.full_name });
      
      const response = await api.post('/api/auth/register', userData);
      console.log('🔧 Registration: Backend response:', response.data);
      
      if (response.data) {
        toast.success('Account created successfully! 🎉');
        
        // Auto-login after registration
        console.log('🔧 Registration: Attempting auto-login...');
        const loginResult = await login({
          email: userData.email,
          password: userData.password
        });
        
        if (loginResult.success) {
          console.log('🔧 Registration: Auto-login successful!');
          return { success: true, data: response.data };
        } else {
          console.log('🔧 Registration: Auto-login failed, but registration succeeded');
          return { success: true, data: response.data, message: 'Account created! Please log in manually.' };
        }
      }
    } catch (error) {
      console.error('❌ Registration: Error occurred:', error);
      console.error('❌ Registration: Error response:', error.response?.data);
      console.error('❌ Registration: Error status:', error.response?.status);
      
      let message = 'Registration failed';
      if (error.response?.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // FastAPI expects form data for OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await api.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.access_token) {
        // Store token
        localStorage.setItem('auth_token', response.data.access_token);
        
        // Get user info
        const userResponse = await api.get('/api/auth/me');
        setUser(userResponse.data);
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        
        toast.success('Welcome back! 👋');
        return { success: true, data: userResponse.data };
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully! 👋');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully! ✅');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.detail || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await api.post('/api/auth/change-password', passwordData);
      toast.success('Password changed successfully! 🔒');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email! 📧');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Reset request failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      await api.post('/api/auth/reset-password', resetData);
      toast.success('Password reset successfully! 🔒');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      await api.post('/api/auth/verify-email', { token });
      toast.success('Email verified successfully! ✅');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Email verification failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Resend verification email
  const resendVerification = async () => {
    try {
      await api.post('/api/auth/resend-verification');
      toast.success('Verification email sent! 📧');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to send verification';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get security info
  const getSecurityInfo = async () => {
    try {
      const response = await api.get('/api/auth/security');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  };

  // Get active sessions
  const getActiveSessions = async () => {
    try {
      const response = await api.get('/api/auth/sessions');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  };

  // Revoke session
  const revokeSession = async (sessionId) => {
    try {
      await api.delete(`/api/auth/sessions/${sessionId}`);
      toast.success('Session revoked successfully! 🔒');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to revoke session';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Revoke all sessions
  const revokeAllSessions = async () => {
    try {
      await api.delete('/api/auth/sessions/all');
      toast.success('All sessions revoked successfully! 🔒');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to revoke sessions';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Check password strength
  const checkPasswordStrength = async (password) => {
    try {
      const response = await api.get(`/api/auth/password-strength?password=${encodeURIComponent(password)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getSecurityInfo,
    getActiveSessions,
    revokeSession,
    revokeAllSessions,
    checkPasswordStrength,
    api, // Expose api instance for other components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 