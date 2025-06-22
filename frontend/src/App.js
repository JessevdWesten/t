import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Dashboard</h1>
    <p>Welcome to FitGenius!</p>
    <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
      ← Back to Home
    </a>
  </div>
);

// 404 Component
const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
      ← Go Home
    </a>
  </div>
);

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
              <BrowserRouter>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<NotFound />} />
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
              </BrowserRouter>
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