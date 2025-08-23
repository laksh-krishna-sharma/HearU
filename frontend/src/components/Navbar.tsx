import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { useEffect, useRef, useState } from "react";
import { pageTransitions, hoverAnimations } from "../utils/animations";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TbActivityHeartbeat } from "react-icons/tb";

interface NavbarProps {
  showCenterOval?: boolean;
}

const Navbar = ({ showCenterOval = true }: NavbarProps) => {
  const { user, access_token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = !!access_token && !!user;

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // State for placeholder visibility and mobile menu
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (navRef.current) {
      pageTransitions.slideInLeft(navRef.current, 0);
    }

    const buttons = document.querySelectorAll(".nav-button");
    const links = document.querySelectorAll(".nav-link");

    buttons.forEach((button) => {
      hoverAnimations.buttonPress(button);
      hoverAnimations.glow(button);
    });

    links.forEach((link) => {
      hoverAnimations.lift(link);
    });

    if (logoRef.current) {
      hoverAnimations.lift(logoRef.current);
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      ref={navRef}
      className="relative flex items-center justify-between p-4 md:p-6 bg-[#DFD3B6] w-full"
    >
      {/* LEFT - Logo */}
      <Link
        to={isAuthenticated ? "/landing" : "/"}
        ref={logoRef}
        className="text-xl md:text-2xl font-bold text-black z-20"
        onClick={closeMobileMenu}
      >
        <span className="text-black">HearU</span>
      </Link>

      {/* CENTER - Voice Assistant Oval (Hidden on mobile when menu is open) */}
      {showCenterOval && (
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
            isMobileMenuOpen 
              ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' 
              : 'opacity-100'
          }`}
        >
          {access_token  && <div className="w-[20rem] md:w-[30rem] h-10 md:h-12 bg-[#eae9e2] justify-center rounded-full flex items-center border border-ocean-primary/30 px-2 md:px-3 gap-2 md:gap-3">
            
            {/* Mic Button with Image */}
            <button
              onClick={() => setShowPlaceholder(false)}
              className="w-8 h-8 md:w-10 md:h-10 text-center hover:scale-110 transition-all duration-200 flex-shrink-0"
              style={{ 
                background: 'none',
                border: 'none',
                padding: 0,
                outline: 'none'
              }}
            >
              <TbActivityHeartbeat className="h-6 w-6 "/>
            </button>
          </div>}
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden z-20 p-2 text-ocean-primary hover:text-ocean-accent transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* RIGHT - Auth Buttons (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-ocean-text truncate max-w-[120px] lg:max-w-[200px]">
              Welcome, {user?.name || user?.username || "User"}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-ocean-accent hover:bg-ocean-accent-dark text-white transition-all duration-200"
            >
              Logout
            </Button>

          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                variant="ghost"
                className="bg-gradient-to-br from-ocean-primary/10 to-ocean-accent/10 text-white hover:from-ocean-primary/20 hover:to-ocean-accent/20 hover:text-amber-300 border border-ocean-primary/20 hover:border-ocean-primary/40 transition-all duration-200"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="outline"
                className="bg-gradient-to-br from-ocean-primary/10 to-ocean-accent/10 border-ocean-primary text-white hover:from-ocean-primary hover:to-ocean-accent hover:text-amber-300 hover:border-ocean-primary transition-all duration-200"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10" 
          onClick={closeMobileMenu} 
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-ocean-navbar shadow-lg transform transition-transform duration-300 ease-in-out z-15 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 pt-20 gap-4">
          {isAuthenticated ? (
            <>
              <div className="mb-4 p-4 bg-gradient-to-br from-ocean-primary/10 to-ocean-accent/10 rounded-lg border border-ocean-primary/20">
                <span className="text-sm text-ocean-text block mb-2">Welcome,</span>
                <span className="font-medium text-ocean-primary">
                  {user?.name || user?.username || "User"}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-ocean-accent hover:bg-ocean-accent-dark text-white transition-all duration-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className="w-full bg-gradient-to-br from-ocean-primary/10 to-ocean-accent/10 text-ocean-primary hover:from-ocean-primary/20 hover:to-ocean-accent/20 hover:text-ocean-primary border border-ocean-primary/20 hover:border-ocean-primary/40 justify-start transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={closeMobileMenu}>
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-br from-ocean-primary/10 to-ocean-accent/10 border-ocean-primary text-ocean-primary hover:from-ocean-primary hover:to-ocean-accent hover:text-white hover:border-ocean-primary justify-start transition-all duration-200"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;