/**
 * Register Page
 */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES } from '../context/CountryContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'Italy',
    role: searchParams.get('role') === 'seller' ? 'seller' : 'buyer',
    storeName: '',
    storeDescription: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      country: formData.country,
      role: formData.role,
      storeName: formData.role === 'seller' ? formData.storeName : undefined,
      storeDescription: formData.role === 'seller' ? formData.storeDescription : undefined
    });
    
    if (result.success) {
      if (formData.role === 'seller') {
        toast.success('Account created! Awaiting admin approval.');
      } else {
        toast.success('Account created successfully!');
      }
      navigate('/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">❄</span>
            </div>
            <span className="text-2xl font-display font-bold text-white">
              ice<span className="text-primary-400">store</span>
            </span>
          </Link>
          <h1 className="mt-6 text-3xl font-display font-bold text-white">Create Account</h1>
          <p className="mt-2 text-gray-400">Join the Mediterranean marketplace</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {/* Role Selector */}
          <div className="flex mb-6 bg-dark-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'buyer' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData.role === 'buyer'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'seller' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData.role === 'seller'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                Country
              </label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="input-field"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seller Fields */}
            {formData.role === 'seller' && (
              <>
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-300 mb-2">
                    Store Name
                  </label>
                  <div className="relative">
                    <BuildingStorefrontIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="storeName"
                      name="storeName"
                      type="text"
                      required={formData.role === 'seller'}
                      value={formData.storeName}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Your Store Name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    Store Description
                  </label>
                  <textarea
                    id="storeDescription"
                    name="storeDescription"
                    rows="3"
                    value={formData.storeDescription}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Tell customers about your store..."
                  />
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Seller accounts require admin approval before you can start selling.
                  </p>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
