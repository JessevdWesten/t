import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

// Auth context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getMe();
          dispatch({ type: 'SET_USER', payload: response.data });
          dispatch({ type: 'SET_TOKEN', payload: token });
        } catch (error) {
          localStorage.removeItem('authToken');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authAPI.login(credentials);
      const { access_token } = response.data;

      localStorage.setItem('authToken', access_token);
      dispatch({ type: 'SET_TOKEN', payload: access_token });

      // Get user data
      const userResponse = await authAPI.getMe();
      dispatch({ type: 'SET_USER', payload: userResponse.data });

      toast.success('Successfully logged in!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await authAPI.register(userData);
      
      // Auto-login after registration
      const loginResult = await login({
        username: userData.email,
        password: userData.password,
      });

      if (loginResult.success) {
        toast.success('Account created successfully!');
      }

      return loginResult;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
    toast.success('Successfully logged out!');
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      const { access_token } = response.data;
      localStorage.setItem('authToken', access_token);
      dispatch({ type: 'SET_TOKEN', payload: access_token });
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 