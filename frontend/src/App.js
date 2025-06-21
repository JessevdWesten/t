import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ExercisesPage from './pages/Exercises/ExercisesPage';
import ExerciseDetailPage from './pages/Exercises/ExerciseDetailPage';
import RecipesPage from './pages/Recipes/RecipesPage';
import RecipeDetailPage from './pages/Recipes/RecipeDetailPage';
import PlansPage from './pages/Plans/PlansPage';
import PlanDetailPage from './pages/Plans/PlanDetailPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import AchievementsPage from './pages/Achievements/AchievementsPage';
import SocialPage from './pages/Social/SocialPage';
import ProfilePage from './pages/Profile/ProfilePage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';

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
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// App Layout Component
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return children; // No layout for public pages
  }
  
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <AppLayout>
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
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/onboarding" 
                      element={
                        <ProtectedRoute>
                          <OnboardingPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Exercise Routes */}
                    <Route 
                      path="/exercises" 
                      element={
                        <ProtectedRoute>
                          <ExercisesPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/exercises/:id" 
                      element={
                        <ProtectedRoute>
                          <ExerciseDetailPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Recipe Routes */}
                    <Route 
                      path="/recipes" 
                      element={
                        <ProtectedRoute>
                          <RecipesPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/recipes/:id" 
                      element={
                        <ProtectedRoute>
                          <RecipeDetailPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Plan Routes */}
                    <Route 
                      path="/plans" 
                      element={
                        <ProtectedRoute>
                          <PlansPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/plans/:id" 
                      element={
                        <ProtectedRoute>
                          <PlanDetailPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Analytics Route */}
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute>
                          <AnalyticsPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Achievements Route */}
                    <Route 
                      path="/achievements" 
                      element={
                        <ProtectedRoute>
                          <AchievementsPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Social Route */}
                    <Route 
                      path="/social" 
                      element={
                        <ProtectedRoute>
                          <SocialPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Profile Route */}
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Notifications Route */}
                    <Route 
                      path="/notifications" 
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
                
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
}

export default App; 