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
    <div className="min-h-screen bg-gradient-to-br from-[#EBE8D5] via-[#F5F3EA] to-[#DFD3B6] relative overflow-hidden">
      {/* Background Image - Right Side */}
      <div className="absolute right-0 top-0 h-full w-1/2 sm:w-1/3 pointer-events-none z-0">
        <img
            src="/buddhaFace3.jpg"
            alt="Buddha Face Right"
            className="h-full w-full object-cover object-left opacity-45  "
          />
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl ml-0 sm:ml-8 lg:ml-12 xl:ml-16">
          
          {/* Header */}
          <div ref={headerRef} className="text-left mb-8 opacity-0">
            {/* <Link to="/" className="inline-block mb-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
                HearU
              </div>
            </Link> */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#6E664E] mb-2">
              Welcome back
            </h1>
            <p className="text-base sm:text-lg text-[#6E664E]/80 max-w-md">
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Login Form */}
          <div 
            ref={formRef} 
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10 opacity-0 max-w-md"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-[#6E664E]"
                >
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
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary 
                           transition-all duration-300 outline-none text-base bg-white/70
                           hover:bg-white/90 focus:bg-white"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-[#6E664E]"
                >
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
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary 
                           transition-all duration-300 outline-none text-base bg-white/70
                           hover:bg-white/90 focus:bg-white"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="flex items-center text-sm text-[#6E664E] cursor-pointer">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-ocean-primary focus:ring-ocean-primary 
                             border-gray-300 rounded mr-2 cursor-pointer"
                  />
                  Remember me
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-ocean-primary hover:text-ocean-primary-dark 
                           transition-colors duration-200 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={authState.loading}
                className={`w-full flex justify-center py-3 sm:py-4 px-6 rounded-lg 
                          shadow-lg text-white font-semibold text-base transform 
                          transition-all duration-300 ${
                  authState.loading
                    ? "bg-gray-400 cursor-not-allowed scale-100"
                    : "bg-ocean-primary hover:bg-ocean-primary-dark hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                }`}
              >
                {authState.loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Error Message */}
            {authState.error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 
                           rounded-lg text-sm font-medium">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {authState.error}
                </div>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="mt-8 text-center ">
              <p className="text-sm text-[#6E664E]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-ocean-primary hover:text-black
                           font-semibold  duration-200 "
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;