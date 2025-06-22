import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import TestRegistration from './pages/Auth/TestRegistration';
import ExercisesPage from './pages/Exercises/ExercisesPage';
import ExerciseDetailPage from './pages/Exercises/ExerciseDetailPage';
import WorkoutBuilderPage from './pages/Exercises/WorkoutBuilderPage';
import WorkoutHistoryPage from './pages/Exercises/WorkoutHistoryPage';
import RecipesPage from './pages/Recipes/RecipesPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SocialPage from './pages/Social/SocialPage';

// Loading and Error Components
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

// Enhanced Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1>🔐 Please Log In</h1>
        <p>You need to be logged in to access the dashboard.</p>
        <button 
          onClick={() => window.location.hash = '#login'}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            padding: '1rem 2rem', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            marginTop: '1rem'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '2rem', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🎉 Welcome Back!</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Hello {user.email || user.full_name || 'Fitness Champion'}!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.hash = ''}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => window.location.hash = '#profile'}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              👤 Profile
            </button>
            <button 
              onClick={logout}
              style={{ 
                background: 'rgba(239, 68, 68, 0.8)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div 
            onClick={() => window.location.hash = '#exercises'}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Workouts</h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Ready to start!</p>
          </div>
          
          <div 
            onClick={() => window.location.hash = '#recipes'}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥗</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Nutrition</h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Track your meals</p>
          </div>
          
          <div 
            onClick={() => window.location.hash = '#analytics'}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Progress</h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Monitor growth</p>
          </div>
          
          <div 
            onClick={() => window.location.hash = '#social'}
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: '1.5rem', 
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'rgba(255,255,255,0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(255,255,255,0.15)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Community</h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Join the fun!</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>
            🚀 Quick Actions
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            <button 
              onClick={() => window.location.hash = '#exercises'}
              style={{ 
                background: 'rgba(16, 185, 129, 0.8)', 
                color: 'white', 
                padding: '1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'transform 0.2s',
                ':hover': { transform: 'scale(1.05)' }
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🏃‍♂️ Start Workout
            </button>
            <button 
              onClick={() => window.location.hash = '#recipes'}
              style={{ 
                background: 'rgba(59, 130, 246, 0.8)', 
                color: 'white', 
                padding: '1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🍎 Explore Recipes
            </button>
            <button 
              onClick={() => window.location.hash = '#analytics'}
              style={{ 
                background: 'rgba(139, 92, 246, 0.8)', 
                color: 'white', 
                padding: '1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📈 View Progress
            </button>
            <button 
              onClick={() => window.location.hash = '#social'}
              style={{ 
                background: 'rgba(245, 158, 11, 0.8)', 
                color: 'white', 
                padding: '1rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              👥 Join Community
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          background: 'rgba(16, 185, 129, 0.2)',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            ✅ <strong>All Features Connected!</strong> Your FitGenius platform is now fully operational with exercises, recipes, analytics, and social features.
          </p>
        </div>
      </div>
    </div>
  );
};

// 404 Component
const NotFound = () => (
  <div style={{ 
    padding: '2rem', 
    textAlign: 'center',
    minHeight: '100vh',
    background: '#1e293b',
    color: 'white'
  }}>
    <h1>🔍 Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <button 
      onClick={() => window.location.hash = ''}
      style={{ 
        background: '#3b82f6', 
        color: 'white', 
        padding: '1rem 2rem', 
        border: 'none', 
        borderRadius: '0.5rem',
        cursor: 'pointer',
        marginTop: '1rem'
      }}
    >
      ← Go Home
    </button>
  </div>
);

// Simple Router Component
const SimpleRouter = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route mapping with exercise detail support
  const routes = {
    '': <LandingPage />,
    '#': <LandingPage />,
    '#/': <LandingPage />,
    '#login': <LoginPage />,
    '#/login': <LoginPage />,
    '#register': <RegisterPage />,
    '#/register': <RegisterPage />,
    '#test-registration': <TestRegistration />,
    '#/test-registration': <TestRegistration />,
    '#dashboard': <Dashboard />,
    '#/dashboard': <Dashboard />,
    '#exercises': <ExercisesPage />,
    '#/exercises': <ExercisesPage />,
    '#workout-builder': <WorkoutBuilderPage />,
    '#/workout-builder': <WorkoutBuilderPage />,
    '#workout-history': <WorkoutHistoryPage />,
    '#/workout-history': <WorkoutHistoryPage />,
    '#recipes': <RecipesPage />,
    '#/recipes': <RecipesPage />,
    '#analytics': <AnalyticsPage />,
    '#/analytics': <AnalyticsPage />,
    '#profile': <ProfilePage />,
    '#/profile': <ProfilePage />,
    '#social': <SocialPage />,
    '#/social': <SocialPage />,
  };

  // Handle exercise detail routes (e.g., #exercise/1, #exercise/push-ups)
  if (currentHash.startsWith('#exercise/') || currentHash.startsWith('#/exercise/')) {
    return <ExerciseDetailPage />;
  }

  return routes[currentHash] || <NotFound />;
};

// Main App Component
function App() {
  console.log('🔧 App: Component starting to render...');
  
  try {
    console.log('🔧 App: About to return JSX (no React Router!)...');
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <div className="App">
                <SimpleRouter />
                
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