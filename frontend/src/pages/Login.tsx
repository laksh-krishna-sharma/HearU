import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import type { RootState } from '../store/store'; 
import { useAppDispatch } from '@/hooks/hooks';

const Login = () => {
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen bg-ocean-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-bold text-ocean-text mb-2">
              <span className="text-ocean-primary">Hear</span>
              <span className="text-ocean-secondary">U</span>
            </div>
          </Link>
          <h2 className="text-2xl font-semibold text-ocean-text">
            Welcome back
          </h2>
          <p className="mt-2 text-ocean-text opacity-70">
            Sign in to continue your wellness journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ocean-text mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                placeholder="Enter your email"
              />
            </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-ocean-primary focus:ring-ocean-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-ocean-text">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-ocean-primary hover:text-ocean-primary-dark transition-all duration-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ocean-primary hover:bg-ocean-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-primary transition-all duration-300 font-medium ${
                  authState.loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-ocean-primary hover:bg-ocean-primary-dark'
                }"
                disabled={authState.loading}
              >
                {authState.loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Display error message */}
          {authState.error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {authState.error}
            </div>
          )}

          {/* Crisis Support Notice */}
          <div className="mt-6 p-4 bg-ocean-accent bg-opacity-10 rounded-lg border border-ocean-accent border-opacity-20">
            <p className="text-sm text-ocean-text text-center">
              <span className="font-semibold text-ocean-accent">In crisis?</span> Call 988 or text "HELLO" to 741741
            </p>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-ocean-text">
              Don't have an account?{' '}
              <Link to="/signup" className="text-ocean-primary hover:text-ocean-primary-dark font-medium transition-all duration-300">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;