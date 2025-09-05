import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { TbActivityHeartbeat } from "react-icons/tb";
import NavbarVoiceSession from "@/components/NavbarVoiceSession";

interface NavbarProps {
  showCenterOval?: boolean;
}

const Navbar = ({ showCenterOval = true }: NavbarProps) => {
  const { user, access_token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = !!access_token && !!user;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };
  // const handleVoiceClick = () => {
  //   // Add your voice functionality here
  //   // Could navigate to voice chat or start voice recording
  // };
  return (
    <nav className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-wellness-cream via-wellness-warm-white to-wellness-soft-gray backdrop-blur-sm border-b border-white/20 shadow-soft w-full relative">
      {/* LEFT - Logo */}
      <Link
        to={isAuthenticated ? "/landing" : "/"}
        className="text-xl md:text-2xl font-bold font-display group transition-all duration-300"
        onClick={() => setIsMenuOpen(false)}
      >
        <span className="text-black">HearU</span>
      </Link>

      {/* CENTER - Voice Assistant Oval */}
      {showCenterOval && isAuthenticated && (
        <div className="animate-fade-in">
          <NavbarVoiceSession />
        </div>
      )}

      {/* RIGHT - Buttons (shared for desktop & mobile) */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full flex-col items-start bg-gradient-to-r from-wellness-cream to-wellness-warm-white backdrop-blur-md border border-white/20 rounded-lg shadow-medium p-4 gap-3 md:static md:flex md:flex-row md:items-center md:w-auto md:p-0 md:bg-none md:backdrop-blur-none md:border-none md:shadow-none md:rounded-none animate-slide-up`}
      >
        {isAuthenticated ? (
          <>
            <span className="text-sm text-ocean-text/80 font-medium animate-fade-in">
              Welcome, {user?.name || user?.username || "User"}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-ocean-accent to-ocean-accent-dark hover:from-ocean-accent-dark hover:to-ocean-accent text-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
              <Button
                variant="ghost"
                className="w-full md:w-auto text-ocean-text hover:text-ocean-primary hover:bg-ocean-primary/10 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-ocean-primary/20"
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
    </nav>
  );
};

export default Navbar;
