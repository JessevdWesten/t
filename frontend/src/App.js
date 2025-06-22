import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

// Simple Dashboard Component
const SimpleDashboard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Please log in to access dashboard</h1>
        <a href="#/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
          Go to Login
        </a>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Dashboard Coming Soon</h1>
      <p>Welcome to FitGenius, {user.email || user.username}!</p>
      <div style={{ marginTop: '1rem' }}>
        <a href="#/" style={{ color: '#3b82f6', textDecoration: 'underline', marginRight: '1rem' }}>
          Home
        </a>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
          }}
          style={{ 
            background: '#ef4444', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<SimpleDashboard />} />
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