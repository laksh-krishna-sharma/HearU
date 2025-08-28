import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/store/slices/authSlice";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TbActivityHeartbeat } from "react-icons/tb";

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
      {showCenterOval && isAuthenticated && (
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
          <div className="w-[20rem] md:w-[30rem] h-10 md:h-12 bg-[#eae9e2] rounded-full     flex items-center justify-center border ">
            <button
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:scale-110 duration-200 "
              style={{ 
              background: 'none',
              border: 'none',
              padding: 0,
              outline: 'none'
              }}
            >
            <TbActivityHeartbeat className="h-16 w-16 text-[#0b132b] "/>
            </button>
          </div>
        </div>
      )}

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
