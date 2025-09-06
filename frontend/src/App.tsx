import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/hooks';
import Navbar from './components/Navbar';
import GlobalBackground from './components/GlobalBackground';
import GlobalEffects from './components/GlobalEffects';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';  
import Dashboard from './pages/Dashboard';
import Blogs from './pages/Blogs';
import LandingPage from './pages/LandingPage';
import Journal from './pages/Journal';
import JournalEditor from './pages/JournalEditor';
import SummaryDetailView from './components/journal/SummaryDetailView';
import BlogPost from './pages/BlogPost';
import Eve from './pages/Eve';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { access_token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!access_token && !!user;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to journal if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { access_token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!access_token && !!user;
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/landing" replace />;
};

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-black text-white">
          {/* Global background & effects */}
          <GlobalEffects />
          <GlobalBackground />
        <Navbar />
        <div className='relative z-10 pt-24'>
          <PageTransition>
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
            <Route path="/blog/:id" element={
              <ProtectedRoute>
                <BlogPost />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Eve />
              </ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            } />
            <Route path="/journal/new" element={
              <ProtectedRoute>
                <JournalEditor />
              </ProtectedRoute>
            } />
            <Route path="/journal/edit/:id" element={
              <ProtectedRoute>
                <JournalEditor />
              </ProtectedRoute>
            } />
            <Route path="/journal/summary/:id" element={
                <ProtectedRoute>
                  <SummaryDetailView />
                </ProtectedRoute>
              } />
            
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </div>
      </div>
    </Router>
  );
}

export default App;
