
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { logout } from '@/store/slices/authSlice';

const Navbar = () => {
  const { user, access_token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = !!access_token && !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-ocean-navbar px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={isAuthenticated ? "/landing" : "/"} className="flex items-center">
          <div className="text-2xl md:text-3xl font-bold text-ocean-text hover:opacity-80 transition-all duration-300">
            <span className="text-ocean-primary">Hear</span>
            <span className="text-ocean-secondary">U</span>
          </div>
        </Link>

        {/* Conditional Navigation Links */}
        {isAuthenticated ? (
          <>
            {/* Authenticated Navigation */}
            <div className="hidden md:flex space-x-6">
              <ul className="flex space-x-6">
                <Link 
                  to="/dashboard"
                  className="text-ocean-text hover:text-ocean-primary transition-all duration-300 font-medium"
                >
                  <li>Dashboard</li>
                </Link>
                <Link 
                  to="/blogs"
                  className="text-ocean-text hover:text-ocean-primary transition-all duration-300 font-medium"
                >
                  <li>Blogs</li>
                </Link>
                <Link 
                  to="/chat"
                  className="text-ocean-text hover:text-ocean-primary transition-all duration-300 font-medium"
                >
                  <li>Chat</li>
                </Link>
              </ul>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-3">
              <span className="hidden md:block text-sm text-ocean-text">
                Welcome, {user?.name || user?.username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-medium text-white bg-ocean-accent rounded-lg transition-all duration-300 hover:bg-ocean-accent-dark focus:outline-none focus:ring-2 focus:ring-ocean-accent focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Unauthenticated Navigation */}
            <div className="hidden md:flex space-x-6">
              <ul className="flex space-x-6">
                <Link 
                  to="/about"
                  className="text-ocean-text hover:text-ocean-primary transition-all duration-300 font-medium"
                >
                  <li>About Us</li>
                </Link>
                <Link 
                  to="/services"
                  className="text-ocean-text hover:text-ocean-primary transition-all duration-300 font-medium"
                >
                  <li>Our Services</li>
                </Link>
                <Link 
                  to="/contact"
                  className="text-ocean-text hover:text-ocean-primary transition-all duration-300 font-medium"
                >
                  <li>Contact Us</li>
                </Link>
              </ul>
            </div>

            {/* Login/Signup Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/login"
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-medium text-ocean-text border-2 border-ocean-primary rounded-lg transition-all duration-300 hover:bg-ocean-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-ocean-primary focus:ring-offset-2 text-center"
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-medium text-white bg-ocean-accent rounded-lg transition-all duration-300 hover:bg-ocean-accent-dark focus:outline-none focus:ring-2 focus:ring-ocean-accent focus:ring-offset-2 text-center"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;