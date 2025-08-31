import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { TbActivityHeartbeat } from "react-icons/tb";
import Eve from "@/components/eve/Eve";

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
    <nav className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-[#EBE8D5] via-[#F5F3EA]  w-full relative">
      {/* LEFT - Logo */}
      <Link
        to={isAuthenticated ? "/landing" : "/"}
        className="text-xl md:text-2xl font-bold "
        onClick={() => setIsMenuOpen(false)}
      >
        <span className="text-black">HearU</span>
      </Link>

      {/* CENTER - Voice Assistant Oval */}
      {showCenterOval && isAuthenticated && (<Eve />)}

      {/* Hamburger (only mobile) */}
      {/* <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-ocean-primary hover:text-ocean-accent transition z-20"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}

      {/* RIGHT - Buttons (shared for desktop & mobile) */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full flex-col items-start  p-4 gap-3 md:static md:flex md:flex-row md:items-center md:w-auto md:p-0`}
      >
        {isAuthenticated ? (
          <>
            <span className="text-sm ">
              Welcome, {user?.name || user?.username || "User"}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-ocean-accent hover:bg-ocean-accent-dark text-white w-full md:w-auto"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto ">
              <Button
                variant="ghost"
                className="w-full md:w-autotransition text-white hover:text-amber-100 "
              >
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
              <Button
                variant="outline"
                className="w-full md:w-autotransition text-white hover:text-amber-100"
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
