/**
 * Admin Users Page
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const roleFilter = searchParams.get('role') || '';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams();
        if (roleFilter) params.append('role', roleFilter);
        if (search) params.append('search', search);
        
        const { data } = await api.get(`/admin/users?${params.toString()}`);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their products.')) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/admin/sellers/${userId}/approve`);
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
      toast.success('Seller approved');
    } catch (error) {
      toast.error('Failed to approve seller');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Manage Users</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input-field pl-10"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {['', 'buyer', 'seller', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  if (role) {
                    newParams.set('role', role);
                  } else {
                    newParams.delete('role');
                  }
                  setSearchParams(newParams);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all
                          ${roleFilter === role
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
              >
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Country</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-1 text-sm text-white"
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">
                        {user.country === 'Algeria' && '🇩🇿'}
                        {user.country === 'Tunisia' && '🇹🇳'}
                        {user.country === 'Italy' && '🇮🇹'}
                        {' '}{user.country}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'seller' && !user.isApproved ? (
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="badge-warning flex items-center space-x-1"
                        >
                          <span>Pending</span>
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="badge-success">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
