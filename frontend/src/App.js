import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Loading and Error Components
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Global Styles
import './styles/GlobalStyles.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main App Component
function App() {
  console.log('🔧 App: Component starting to render...');
  
  try {
    console.log('🔧 App: About to return JSX...');
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <Router>
                <div className="App">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route 
                      path="/login" 
                      element={
                        <PublicRoute>
                          <LoginPage />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        <PublicRoute>
                          <RegisterPage />
                        </PublicRoute>
                      } 
                    />
                    
                    {/* Simple dashboard placeholder */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <h1>Dashboard Coming Soon</h1>
                            <p>Welcome to FitGenius!</p>
                          </div>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  
                  {/* Global Components */}
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                      },
                      success: {
                        iconTheme: {
                          primary: '#10b981',
                          secondary: '#f8fafc',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#f8fafc',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('❌ App: Critical error in App component:', error);
    return <div>Critical App Error: {error.message}</div>;
  }
}

export default App; 