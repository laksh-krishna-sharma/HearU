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

  // Redirect after successful login
  useEffect(() => {
    if (authState.user && authState.access_token) {
      navigate("/landing");
    }
  }, [authState.user, authState.access_token, navigate]);

  // Animations
  useEffect(() => {
    const tl = createTimeline({ delay: 0.2 });

    if (headerRef.current && formRef.current) {
      tl.add(pageTransitions.fadeInUp(headerRef.current, 0))
        .add(pageTransitions.fadeInScale(formRef.current, 0.2), "-=0.3");
    }

    if (submitBtnRef.current) {
      hoverAnimations.buttonPress(submitBtnRef.current);
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      

      {/* Content Container */}
      <div className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl ml-0 sm:ml-8 lg:ml-12 xl:ml-16">
          
          {/* Header */}
          <div ref={headerRef} className="text-left mb-12 opacity-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-4 leading-tight">
              Welcome{' '}
              <span className="bg-gradient-to-r from-ocean-primary via-ocean-secondary to-wellness-sage bg-clip-text text-transparent">
                back
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-md leading-relaxed">
              Sign in to continue your wellness journey with compassion and care
            </p>
          </div>

          {/* Enhanced Login Form */}
          <div 
            ref={formRef} 
            className="bg-gradient-to-br from-white/90 to-wellness-cream/60 backdrop-blur-md rounded-2xl shadow-large border border-white/40 p-8 sm:p-10 lg:p-12 opacity-0 max-w-lg"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Email Field */}
              <div className="space-y-3">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-ocean-text/80"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 border-2 border-white/40 rounded-xl 
                             focus:ring-2 focus:ring-ocean-primary/50 focus:border-ocean-primary 
                             transition-all duration-300 outline-none text-base bg-white/80
                             hover:bg-white/90 focus:bg-white backdrop-blur-sm shadow-soft
                             hover:shadow-medium focus:shadow-medium placeholder:text-ocean-text/40"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ocean-primary/5 to-ocean-secondary/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-ocean-text/80"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 border-2 border-white/40 rounded-xl 
                             focus:ring-2 focus:ring-ocean-primary/50 focus:border-ocean-primary 
                             transition-all duration-300 outline-none text-base bg-white/80
                             hover:bg-white/90 focus:bg-white backdrop-blur-sm shadow-soft
                             hover:shadow-medium focus:shadow-medium placeholder:text-ocean-text/40"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ocean-primary/5 to-ocean-secondary/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center text-sm text-ocean-text/70 cursor-pointer group">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-ocean-primary focus:ring-ocean-primary/50 
                             border-2 border-white/40 rounded mr-3 cursor-pointer transition-all duration-300
                             checked:bg-ocean-primary checked:border-ocean-primary"
                  />
                  <span className="group-hover:text-ocean-text transition-colors duration-300">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-ocean-primary hover:text-ocean-secondary 
                           transition-colors duration-300 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Enhanced Submit Button */}
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={authState.loading}
                className={`w-full flex justify-center py-4 px-6 rounded-xl 
                          shadow-medium text-white font-semibold text-base transform 
                          transition-all duration-300 relative overflow-hidden group ${
                  authState.loading
                    ? "bg-gray-400 cursor-not-allowed scale-100"
                    : "bg-gradient-to-r from-ocean-primary to-ocean-secondary hover:from-ocean-secondary hover:to-ocean-primary hover:scale-105 hover:shadow-large active:scale-95"
                }`}
              >
                {!authState.loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                {authState.loading ? (
                  <span className="flex items-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="relative z-10">Sign in to your sanctuary</span>
                )}
              </button>
            </form>

            {/* Enhanced Error Message */}
            {authState.error && (
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50/80 to-red-100/60 border-2 border-red-200/60 text-red-700 
                           rounded-xl text-sm font-medium backdrop-blur-sm shadow-soft animate-slide-up">
                <div className="flex items-center">
                  <div className="p-1 bg-red-100 rounded-full mr-3">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{authState.error}</span>
                </div>
              </div>
            )}

            {/* Enhanced Sign Up Link */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-wellness-cream/40 to-wellness-warm-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <p className="text-sm text-ocean-text/70">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-ocean-primary hover:text-ocean-secondary
                             font-semibold transition-all duration-300 hover:underline
                             bg-gradient-to-r from-ocean-primary to-ocean-secondary bg-clip-text hover:text-transparent"
                  >
                    Start your wellness journey
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;