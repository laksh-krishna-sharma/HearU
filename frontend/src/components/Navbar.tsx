import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { useEffect, useRef } from "react";
import { pageTransitions, hoverAnimations } from "../utils/animations";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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

  return (
    <nav
      ref={navRef}
      className="relative flex items-center justify-between p-4 md:p-6 bg-ocean-navbar shadow-sm opacity-0"
    >
      {/* LEFT - Logo */}
      <Link
        to={isAuthenticated ? "/landing" : "/"}
        ref={logoRef}
        className="text-2xl font-bold text-ocean-primary hover:opacity-80 transition-all duration-300"
      >
        Hear<span className="text-ocean-secondary">U</span>
      </Link>

      {/* CENTER - Voice Assistant Oval */}
      {showCenterOval && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-10 md:w-36 md:h-12 bg-gradient-to-br from-ocean-primary/20 to-ocean-accent/20 rounded-full flex items-center justify-center border border-ocean-primary/30">
            <button className="w-8 h-8 md:w-9 md:h-9 bg-ocean-primary rounded-full flex items-center justify-center hover:bg-ocean-accent transition-colors">
              <Mic className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* RIGHT - Auth Buttons */}
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-ocean-text truncate max-w-[120px]">
            Welcome, {user?.name || user?.username || "User"}
          </span>
          <Button
            onClick={handleLogout}
            className="bg-ocean-accent hover:bg-ocean-accent-dark text-white"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-ocean-text hover:text-ocean-primary"
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="outline"
              className="border-ocean-primary text-ocean-primary hover:bg-ocean-primary hover:text-white"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
