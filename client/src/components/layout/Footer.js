/**
 * Footer Component
 * Site footer with links and branding
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { COUNTRIES } from '../../context/CountryContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">❄</span>
              </div>
              <span className="text-xl font-display font-bold text-white">
                ice<span className="text-primary-400">store</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Your premium e-commerce destination for products across Algeria, Tunisia, and Italy. 
              Shop with confidence and discover amazing products from Mediterranean sellers.
            </p>
            <div className="flex space-x-4">
              {COUNTRIES.map((country) => (
                <div key={country.code} className="flex items-center space-x-1 text-gray-400">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/register?role=seller" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-primary-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} icestore. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Secure Payments</span>
              <span>•</span>
              <span>Quality Guaranteed</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
