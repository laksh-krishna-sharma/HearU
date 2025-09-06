import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
// import NavbarVoiceSession from "@/components/NavbarVoiceSession";

// interface NavbarProps {
//   showCenterOval?: boolean;
// }

// const Navbar = ({ showCenterOval = true }: NavbarProps) => {
const Navbar = () => {
  const { user, access_token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = !!access_token && !!user;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ensure portal renders client-side only
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navContent = (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-[99999] pointer-events-auto p-4 md:p-6 bg-black/85 backdrop-blur-md border-b border-white/10 shadow-soft w-full"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* LEFT - Logo */}
        <Link
          to={isAuthenticated ? "/landing" : "/"}
          className="text-xl md:text-2xl font-bold font-display group transition-all duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-white">HearU</span>
        </Link>

        {/* CENTER - Voice Assistant Oval  */}
        {/* {showCenterOval && isAuthenticated && (
          <div className="hidden md:block animate-fade-in">
            <NavbarVoiceSession />
          </div>
        )} */}

        {/* RIGHT - Buttons */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } absolute top-full left-0 w-full flex-col items-start bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-medium p-4 gap-3 md:static md:flex md:flex-row md:items-center md:w-auto md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none md:rounded-none`}
        >
          {isAuthenticated ? (
            <>
              <span className="text-sm text-white/80 font-medium animate-fade-in">
                Welcome, {user?.name || user?.username}
              </span>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r text-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
                <Button
                  variant="ghost"
                  className="w-full md:w-auto text-white hover:text-ocean-primary hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-white/20"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
                <Button
                  variant="outline"
                  className="w-full md:w-auto bg-gradient-to-r from-ocean-primary to-ocean-secondary text-white border-none shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 hover:from-ocean-secondary hover:to-ocean-primary"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle (simple) */}
        <button
          aria-label="Toggle menu"
          className="md:hidden ml-3 text-white"
          onClick={() => setIsMenuOpen((s) => !s)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>
    </nav>
  );

  if (!mounted) return null;
  return createPortal(navContent, document.body);
};

export default Navbar;
