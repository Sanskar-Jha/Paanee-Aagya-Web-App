import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingOverlay } from './components/Loading';
import NetworkStatus from './components/NetworkStatus';
import PrivateRoute from './components/PrivateRoute';
import NotificationPrompt from './components/NotificationPrompt';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import CompleteProfile from './pages/CompleteProfile';
import InstallPrompt from './components/InstallPrompt';
// import AdminSetup from './components/AdminSetup'; // Temp

// Component to handle profile completion redirect
function ProfileCompletionHandler({ children }) {
  const { needsProfileCompletion, currentUser, loading } = useAuth();

  if (!loading) {
    return <LoadingOverlay message="Checking your profile..." />;
  }

  if (currentUser && needsProfileCompletion()) {
    return <Navigate to="/complete-profile" />;
  }

  return children;
}

// Component to handle conditional routing
function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (!loading) {
    return <LoadingOverlay message="Loading Paanee Aagya..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NetworkStatus />
      <main>
        <Routes>
          {/* Redirect root to login if not authenticated, otherwise to home */}
          <Route
            path="/"
            element={
              currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />

          {/* Public routes - redirect to home if already authenticated */}
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/home" /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              currentUser ? <Navigate to="/home" /> : <Signup />
            }
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <ProfileCompletionHandler>
                  <Home />
                </ProfileCompletionHandler>
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <ProfileCompletionHandler>
                  <About />
                </ProfileCompletionHandler>
              </PrivateRoute>
            }
          />
          <Route
            path="/complete-profile"
            element={
              <CompleteProfile />
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <ProfileCompletionHandler>
                  <Admin />
                </ProfileCompletionHandler>
              </PrivateRoute>
            }
          />

          {/* Add this route inside AppRoutes component (temporary - remove after setup) */}
          {/* <Route
            path="/setup-admin"
            element={<AdminSetup />}
          /> */}

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <NotificationPrompt />
      <InstallPrompt />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;