import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

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

// Simple Dashboard Component
const Dashboard = () => (
  <div style={{ 
    padding: '2rem', 
    textAlign: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  }}>
    <h1>🎉 Dashboard Working!</h1>
    <p>Welcome to FitGenius - No more React Router errors!</p>
    <div style={{ marginTop: '2rem' }}>
      <button 
        onClick={() => window.location.hash = ''}
        style={{ 
          background: 'rgba(255,255,255,0.2)', 
          color: 'white', 
          padding: '1rem 2rem', 
          border: 'none', 
          borderRadius: '0.5rem',
          cursor: 'pointer',
          marginRight: '1rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        ← Home
      </button>
      <button 
        onClick={() => window.location.hash = '#login'}
        style={{ 
          background: 'rgba(255,255,255,0.2)', 
          color: 'white', 
          padding: '1rem 2rem', 
          border: 'none', 
          borderRadius: '0.5rem',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        Login Page
      </button>
    </div>
  </div>
);

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

  // Route mapping
  const routes = {
    '': <LandingPage />,
    '#': <LandingPage />,
    '#/': <LandingPage />,
    '#login': <LoginPage />,
    '#/login': <LoginPage />,
    '#register': <RegisterPage />,
    '#/register': <RegisterPage />,
    '#dashboard': <Dashboard />,
    '#/dashboard': <Dashboard />,
  };

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