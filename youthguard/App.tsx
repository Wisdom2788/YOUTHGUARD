import React, { useContext, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';

import CourseDetailsPage from './pages/CourseDetailsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import MessagesPage from './pages/MessagesPage';
import ProgressPage from './pages/ProgressPage';

import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectionStatus from './components/ConnectionStatus';

// Simple layout without sidebar for landing page
const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {children}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Navigate to="/" replace />;
  }
  const { isAuthenticated, authCheckComplete } = authContext;
  
  // If we haven't completed the auth check yet, show a loading state
  if (!authCheckComplete) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const openAuthModal = (view: 'login' | 'register') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <HashRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={
              <SimpleLayout>
                <LandingPage openAuthModal={openAuthModal} />
              </SimpleLayout>
            } />
          
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/courses" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CoursesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/courses/:id" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CourseDetailsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            

            
            <Route path="/jobs" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <JobsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/jobs/:id" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <JobDetailsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MessagesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/progress" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProgressPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
          initialView={authView} 
        />
        <ConnectionStatus />
          </HashRouter>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;