import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Main pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import ExercisesPage from './pages/Exercises/ExercisesPage';
import RecipesPage from './pages/Recipes/RecipesPage';
import PlansPage from './pages/Plans/PlansPage';
import PlanDetailPage from './pages/Plans/PlanDetailPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Check if user needs onboarding
const OnboardingCheck = ({ children }) => {
  const { user } = useAuth();
  
  // If user doesn't have basic profile info, redirect to onboarding
  const needsOnboarding = user && (!user.age || !user.gender || !user.height_cm || !user.weight_kg || !user.goal);
  
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
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

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Onboarding route (no onboarding check) */}
          <Route path="onboarding" element={<OnboardingPage />} />
          
          {/* Main app routes (with onboarding check) */}
          <Route
            path="dashboard"
            element={
              <OnboardingCheck>
                <DashboardPage />
              </OnboardingCheck>
            }
          />
          <Route
            path="profile"
            element={
              <OnboardingCheck>
                <ProfilePage />
              </OnboardingCheck>
            }
          />
          <Route
            path="exercises"
            element={
              <OnboardingCheck>
                <ExercisesPage />
              </OnboardingCheck>
            }
          />
          <Route
            path="recipes"
            element={
              <OnboardingCheck>
                <RecipesPage />
              </OnboardingCheck>
            }
          />
          <Route
            path="plans"
            element={
              <OnboardingCheck>
                <PlansPage />
              </OnboardingCheck>
            }
          />
          <Route
            path="plans/:id"
            element={
              <OnboardingCheck>
                <PlanDetailPage />
              </OnboardingCheck>
            }
          />
          
          {/* Default redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App; 