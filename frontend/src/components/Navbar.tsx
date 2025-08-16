
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-ocean-navbar px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="./logo.png" alt="Logo" className="h-8 cursor-pointer" />
          <div className="text-2xl md:text-3xl font-bold text-ocean-text hover:opacity-80 transition-all duration-300">
            
            <span className="text-ocean-primary">Hear</span>
            <span className="text-ocean-secondary">U</span>
          </div>
        </Link>

        <div className="hidden md:flex space-x-6">
          <ul className="flex space-x-6">
            <Link to="/about">
              <li>About Us</li>
            </Link>
            <Link to="/services">
              <li>Our Services</li>
            </Link>
            <Link to="/contact">
              <li>Contact Us</li>
            </Link>
            <Link to="/chat">
              <li>Chat</li>
            </Link>
          </ul>
        </div>

        {/* Navigation Buttons */}
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
      </div>
    </nav>
  );
};

export default Navbar;