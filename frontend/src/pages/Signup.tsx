import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signup } from '../store/slices/authSlice';
import { useAppDispatch } from '@/hooks/hooks';
import type { RootState } from '@/store/store';
import { pageTransitions, createTimeline } from "../utils/animations";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  gender: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
  agreeToTerms: boolean;
}

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    age: 13,
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    agreeToTerms: false
  });

  // Redirect after successful signup
  useEffect(() => {
    if (authState.user && authState.access_token) {
      navigate('/landing');
    }
  }, [authState.user, authState.access_token, navigate]);

  // Animations
  useEffect(() => {
    const tl = createTimeline({ delay: 0.2 });

    if (headerRef.current && formRef.current ) { 
      tl.add(pageTransitions.fadeInUp(headerRef.current, 0))
        .add(pageTransitions.fadeInScale(formRef.current, 0.2), "-=0.2");
    }

    return () => {
      tl.kill();
    };
  }, [currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, profileImage: file }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, username, age, gender } = formData;
    if (!firstName || !lastName || !username || !age || !gender) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { email, password, confirmPassword, agreeToTerms } = formData;
    
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all required fields');
      return false;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    
    if (!agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep2()) {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        username: formData.username,
        age: formData.age,
        gender: formData.gender,
      };
      
      dispatch(signup(payload));
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-primary focus:border-ocean-primary transition-all duration-300 outline-none bg-white/70 hover:bg-white/90 focus:bg-white";
  const labelClass = "block text-sm font-semibold text-[#6E664E] mb-2";

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
      <div className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl ml-0 sm:ml-8 lg:ml-12 xl:ml-16">
          
          {/* Header */}
          <div ref={headerRef} className="text-left mb-6 opacity-0">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#6E664E] mb-2">
              Join our community
            </h1>
            <p className="text-base text-[#6E664E]/80 max-w-md">
              Start your mental wellness journey today
            </p>
          </div>          

          {/* Signup Form */}
          <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 sm:p-8 opacity-0 max-w-md">
            
            {currentStep === 1 ? (
              /* Step 1: Personal Information */
              <form className="space-y-4" onSubmit={handleNextStep}>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-[#6E664E]">Tell us about yourself</h3>
                  <p className="text-sm text-[#6E664E]/70">We'll keep your information private</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>First name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className={labelClass}>Last name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className={labelClass}>Username *</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Choose a username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="age" className={labelClass}>Age *</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="13"
                      max="100"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Age"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className={labelClass}>Gender *</label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-ocean-primary hover:bg-ocean-primary-dark text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  Continue to Account Setup
                </button>
              </form>
            ) : (
              /* Step 2: Account Setup */
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-[#6E664E]">Create your account</h3>
                  <p className="text-sm text-[#6E664E]/70">Set up your login credentials</p>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>Email address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>Password *</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Create password (min 6 chars)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirm password *</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Profile Image Upload */}
                <div>
                  <label className={labelClass}>Profile Picture (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-ocean-primary transition-colors">
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer text-sm text-ocean-primary hover:text-ocean-primary-dark font-medium"
                    >
                      {formData.profileImage ? formData.profileImage.name : 'Choose file or drag here'}
                    </label>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-ocean-primary focus:ring-ocean-primary border-gray-300 rounded mt-1 mr-3"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-[#6E664E]">
                    I agree to the{' '}
                    <Link to="/terms" className="text-ocean-primary hover:text-ocean-primary-dark font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-ocean-primary hover:text-ocean-primary-dark font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-4 border border-ocean-primary text-ocean-primary bg-white/70 hover:bg-ocean-primary hover:text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={authState.loading}
                    className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all duration-300 ${
                      authState.loading
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-ocean-accent hover:bg-ocean-accent-dark text-white hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {authState.loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Error Message */}
            {authState.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {authState.error}
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#6E664E]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-ocean-primary hover:text-ocean-primary-dark font-semibold transition-colors duration-200 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;