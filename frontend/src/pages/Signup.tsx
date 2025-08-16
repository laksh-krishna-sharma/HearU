import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearError, login, signup } from '../store/slices/authSlice';
import type { User } from '../store/slices/authSlice';


interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  username: string;
  age: string;
  gender: string;
  // Step 2
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
  agreeToTerms: boolean;
}

const Signup = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    agreeToTerms: false
  });


  const handlesignup = () => {
    // Handle signup logic here
    dispatch(signup(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      profileImage: file
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate step 1
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.age || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service');
      return;
    }
    console.log('Signup attempt:', formData);
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
            Join our community
          </h2>
          <p className="mt-2 text-ocean-text opacity-70">
            Start your mental wellness journey today
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-ocean-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium text-ocean-text">Personal Info</span>
            </div>
            <div className="flex-1 mx-4">
              <div className={`h-1 rounded-full ${currentStep >= 2 ? 'bg-ocean-primary' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-ocean-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium text-ocean-text">Account Setup</span>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 ? (
            /* Step 1: Personal Information */
            <form className="space-y-6" onSubmit={handleNextStep}>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-ocean-text">Tell us about yourself</h3>
                <p className="text-sm text-ocean-text opacity-70">We'll keep your information safe and private</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-ocean-text mb-2">
                    First name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-ocean-text mb-2">
                    Last name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-ocean-text mb-2">
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                  placeholder="Choose a unique username"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-ocean-text mb-2">
                  Age *
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="13"
                  max="100"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-ocean-text mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                >
                  <option value="">Select your gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ocean-primary hover:bg-ocean-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-primary transition-all duration-300 font-medium"
                >
                  Continue to Account Setup
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Account Setup */
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-ocean-text">Create your account</h3>
                <p className="text-sm text-ocean-text opacity-70">Almost there! Set up your login credentials</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ocean-text mb-2">
                  Email address *
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
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                  placeholder="Create a strong password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-ocean-text mb-2">
                  Confirm password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none"
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-ocean-text mb-2">
                  Profile Picture (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-ocean-primary transition-all duration-300">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="profileImage" className="relative cursor-pointer bg-white rounded-md font-medium text-ocean-primary hover:text-ocean-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ocean-primary">
                        <span>Upload a photo</span>
                        <input
                          id="profileImage"
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    {formData.profileImage && (
                      <p className="text-sm text-ocean-primary font-medium">
                        Selected: {formData.profileImage.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-ocean-primary focus:ring-ocean-primary border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-ocean-text">
                  I agree to the{' '}
                  <a href="#" className="text-ocean-primary hover:text-ocean-primary-dark">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-ocean-primary hover:text-ocean-primary-dark">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 flex justify-center py-3 px-4 border border-ocean-primary rounded-lg shadow-sm text-ocean-primary bg-white hover:bg-ocean-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-primary transition-all duration-300 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ocean-accent hover:bg-ocean-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-accent transition-all duration-300 font-medium"
                  onClick={handlesignup}
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* Crisis Support Notice */}
          <div className="mt-6 p-4 bg-ocean-primary bg-opacity-10 rounded-lg border border-ocean-primary border-opacity-20">
            <p className="text-sm text-ocean-text text-center">
              <span className="font-semibold text-ocean-primary">Need immediate help?</span> Call 988 or text "HELLO" to 741741
            </p>
          </div>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-ocean-text">
              Already have an account?{' '}
              <Link to="/login" className="text-ocean-primary hover:text-ocean-primary-dark font-medium transition-all duration-300">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;