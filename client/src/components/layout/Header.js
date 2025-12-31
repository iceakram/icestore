/**
 * Header Component
 * Main navigation bar with logo, search, cart, and user menu
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCountry, COUNTRIES } from '../../context/CountryContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { selectedCountry, changeCountry } = useCountry();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">❄</span>
            </div>
            <span className="text-xl font-display font-bold text-white">
              ice<span className="text-primary-400">store</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-dark-800/50 border border-dark-600 rounded-xl py-2 pl-10 pr-4
                         text-white placeholder-gray-500 focus:outline-none focus:border-primary-500
                         transition-all duration-300"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-800/50 
                         border border-dark-600 hover:border-primary-500/50 transition-all duration-300"
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-sm text-gray-300">{selectedCountry.code}</span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>

              {countryMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card py-2 animate-fadeIn">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        changeCountry(country.code);
                        setCountryMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-dark-700/50 
                                transition-colors ${selectedCountry.code === country.code ? 'bg-primary-500/20' : ''}`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-gray-300">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-dark-800/50 rounded-lg transition-colors">
              <ShoppingCartIcon className="w-6 h-6 text-gray-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full 
                               flex items-center justify-center text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-dark-800/50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 
                                flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDownIcon className="hidden sm:block w-4 h-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card py-2 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-dark-700">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500/20 text-primary-300 
                                     text-xs rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-dark-700/50 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-dark-700/50 transition-colors"
                    >
                      My Orders
                    </Link>
                    
                    {(user?.role === 'seller' || user?.role === 'admin') && (
                      <>
                        <div className="border-t border-dark-700 my-2" />
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-gray-300 hover:bg-dark-700/50 transition-colors"
                        >
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-gray-300 hover:bg-dark-700/50 transition-colors"
                        >
                          My Products
                        </Link>
                      </>
                    )}
                    
                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t border-dark-700 my-2" />
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-gray-300 hover:bg-dark-700/50 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-dark-700 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-dark-700/50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-dark-800/50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-300" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700 animate-slideIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </form>

            {/* Mobile Country Selector */}
            <div className="flex items-center space-x-2 mb-4">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => changeCountry(country.code)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all
                            ${selectedCountry.code === country.code 
                              ? 'bg-primary-500/20 border-primary-500/50' 
                              : 'border-dark-600 hover:border-primary-500/30'}`}
                >
                  <span>{country.flag}</span>
                  <span className="text-sm">{country.code}</span>
                </button>
              ))}
            </div>

            {/* Mobile Nav Links */}
            <nav className="space-y-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:bg-dark-800/50 rounded-lg transition-colors"
              >
                All Products
              </Link>
              
              {!isAuthenticated && (
                <div className="pt-4 space-y-2 border-t border-dark-700">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center btn-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
