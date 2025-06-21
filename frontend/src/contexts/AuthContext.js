import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', userData);
      
      if (response.data) {
        toast.success('Account created successfully! 🎉');
        
        // Auto-login after registration
        await login({
          email: userData.email,
          password: userData.password
        });
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
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

      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.access_token) {
        // Store token
        localStorage.setItem('auth_token', response.data.access_token);
        
        // Get user info
        const userResponse = await api.get('/auth/me');
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
      await api.post('/auth/change-password', passwordData);
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
      await api.post('/auth/forgot-password', { email });
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
      await api.post('/auth/reset-password', resetData);
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
      await api.post('/auth/verify-email', { token });
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
      await api.post('/auth/resend-verification');
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
      const response = await api.get('/auth/security');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  };

  // Get active sessions
  const getActiveSessions = async () => {
    try {
      const response = await api.get('/auth/sessions');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  };

  // Revoke session
  const revokeSession = async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
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
      await api.delete('/auth/sessions/all');
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
      const response = await axios.get(`/api/auth/password-strength?password=${encodeURIComponent(password)}`);
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