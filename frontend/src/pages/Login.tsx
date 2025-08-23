import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import type { RootState } from "../store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { pageTransitions, hoverAnimations, createTimeline } from "../utils/animations";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Redirect after successful login
  useEffect(() => {
    if (authState.user && authState.access_token) {
      navigate("/landing");
    }
  }, [authState.user, authState.access_token, navigate]);

  // Animations
  useEffect(() => {
    const tl = createTimeline({ delay: 0.2 });

    if (headerRef.current && formRef.current && imageRef.current) {
      tl.add(pageTransitions.fadeInUp(headerRef.current, 0))
        .add(pageTransitions.fadeInScale(formRef.current, 0.2), "-=0.3")
        .add(pageTransitions.fadeInUp(imageRef.current, 0.1), "-=0.2");
    }

    if (submitBtnRef.current) {
      hoverAnimations.buttonPress(submitBtnRef.current);
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen bg-[#DFD3B6] flex items-center justify-center px-8">
      <div className="relative max-w-7xl w-full flex items-center justify-between gap-12">
        
        {/* Left Side - Form */}
        <div className="w-full max-w-md xl:max-w-lg space-y-8 z-10">
          {/* Header */}
          <div ref={headerRef} className="text-center opacity-0">
            <Link to="/" className="inline-block">
              <div className="text-4xl font-bold text-black mb-2">HearU</div>
            </Link>
            <h2 className="text-3xl font-semibold text-ocean-text">Welcome back</h2>
            <p className="mt-2 text-lg text-ocean-text opacity-70">
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Login Form */}
          <div ref={formRef} className="bg-[#DFD3B6] rounded-xl shadow-lg p-10 opacity-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#6E664E] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ocean-text mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none text-base"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-ocean-text">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-ocean-primary focus:ring-ocean-primary border-gray-300 rounded mr-2"
                  />
                  Remember me
                </label>
                <a href="#" className="text-ocean-primary hover:text-ocean-primary-dark transition">
                  Forgot your password?
                </a>
              </div>

              {/* Submit */}
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={authState.loading}
                className={`w-full flex justify-center py-4 px-4 rounded-lg shadow-sm text-white font-medium transform transition-all duration-300 ${
                  authState.loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-ocean-primary hover:bg-ocean-primary-dark hover:scale-105"
                }`}
              >
                {authState.loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Error */}
            {authState.error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {authState.error}
              </div>
            )}

            {/* Sign Up */}
            <div className="mt-6 text-center">
              <p className="text-sm text-ocean-text">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-ocean-primary hover:text-ocean-primary-dark font-medium transition"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2 sm:w-1/3 overflow-hidden pointer-events-none">
            <img
              src="/buddhaFace3.jpg"
              alt="Buddha Face Right"
              className="h-full w-full object-cover object-left opacity-40 hover:opacity-40 transition-opacity duration-500"
            />
          </div>
    </div>
  );
};

export default Login;
