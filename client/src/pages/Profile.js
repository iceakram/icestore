/**
 * Profile Page
 */

import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES } from '../context/CountryContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || user?.country || ''
    },
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);
    
    if (result.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-white mb-8">My Profile</h1>

        {/* Account Info Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="badge-primary capitalize">{user?.role}</span>
                {user?.role === 'seller' && (
                  <span className={user?.isApproved ? 'badge-success' : 'badge-warning'}>
                    {user?.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white">Edit Profile</h3>

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field pl-10 opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+39 123 456 7890"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t border-dark-700 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPinIcon className="w-5 h-5 text-primary-400" />
                <h4 className="text-white font-medium">Address</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Rome"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">State/Province</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Lazio"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="00100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Country</label>
                  <select
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seller Fields */}
            {user?.role === 'seller' && (
              <div className="border-t border-dark-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BuildingStorefrontIcon className="w-5 h-5 text-primary-400" />
                  <h4 className="text-white font-medium">Store Information</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Store Name</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Your Store Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Store Description</label>
                    <textarea
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                      className="input-field h-24 resize-none"
                      placeholder="Tell customers about your store..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
