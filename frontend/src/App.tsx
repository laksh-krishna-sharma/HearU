import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/hooks';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';  
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Blogs from './pages/Blogs';
import LandingPage from './pages/LandingPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { access_token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!access_token && !!user;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to landing if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { access_token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!access_token && !!user;
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/landing" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ocean-background">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/landing" element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/blogs" element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
