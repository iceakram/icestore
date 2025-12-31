/**
 * Admin Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useCountry } from '../context/CountryContext';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { formatPrice } = useCountry();
  const [stats, setStats] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, sellersRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/sellers/pending')
        ]);
        setStats(dashboardRes.data.stats);
        setRecentOrders(dashboardRes.data.recentOrders);
        setPendingSellers(sellersRes.data.sellers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await api.put(`/admin/sellers/${userId}/approve`);
      setPendingSellers(pendingSellers.filter(s => s._id !== userId));
      toast.success('Seller approved successfully');
    } catch (error) {
      toast.error('Failed to approve seller');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this seller application?')) {
      return;
    }
    try {
      await api.put(`/admin/sellers/${userId}/reject`);
      setPendingSellers(pendingSellers.filter(s => s._id !== userId));
      toast.success('Seller application rejected');
    } catch (error) {
      toast.error('Failed to reject seller');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'from-blue-500 to-cyan-600',
      link: '/admin/users'
    },
    {
      title: 'Total Sellers',
      value: stats?.totalSellers || 0,
      icon: UserPlusIcon,
      color: 'from-purple-500 to-primary-600',
      link: '/admin/users?role=seller'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: CubeIcon,
      color: 'from-green-500 to-emerald-600',
      link: '/admin/products'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0, 'EUR'),
      icon: CurrencyDollarIcon,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link 
              key={index} 
              to={stat.link || '#'}
              className="glass-card p-6 hover:border-primary-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Sellers */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Pending Seller Approvals</h2>
              <span className="badge-warning">{stats?.pendingSellers || 0} pending</span>
            </div>

            {pendingSellers.length > 0 ? (
              <div className="space-y-4">
                {pendingSellers.map((seller) => (
                  <div key={seller._id} className="p-4 bg-dark-800/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{seller.name}</p>
                        <p className="text-gray-500 text-sm">{seller.email}</p>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {seller.country === 'Algeria' && '🇩🇿'}
                        {seller.country === 'Tunisia' && '🇹🇳'}
                        {seller.country === 'Italy' && '🇮🇹'}
                        {seller.country}
                      </span>
                    </div>
                    
                    {seller.storeName && (
                      <div className="mb-3">
                        <p className="text-primary-400 text-sm font-medium">{seller.storeName}</p>
                        {seller.storeDescription && (
                          <p className="text-gray-500 text-xs">{seller.storeDescription}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(seller._id)}
                        className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(seller._id)}
                        className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No pending approvals</p>
            )}
          </div>

          {/* Recent Orders */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <span className="text-gray-400 text-sm">{stats?.totalOrders || 0} total</span>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                    <div>
                      <p className="text-white font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {order.user?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {formatPrice(order.totalAmount, order.currency)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-300' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="glass-card p-4 flex items-center space-x-4 hover:border-primary-500/30 transition-all">
            <UsersIcon className="w-8 h-8 text-primary-400" />
            <div>
              <p className="text-white font-medium">Manage Users</p>
              <p className="text-gray-500 text-sm">View and manage all users</p>
            </div>
          </Link>
          <Link to="/admin/products" className="glass-card p-4 flex items-center space-x-4 hover:border-primary-500/30 transition-all">
            <CubeIcon className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-white font-medium">Manage Products</p>
              <p className="text-gray-500 text-sm">View and manage all products</p>
            </div>
          </Link>
          <Link to="/products" className="glass-card p-4 flex items-center space-x-4 hover:border-primary-500/30 transition-all">
            <ShoppingCartIcon className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-white font-medium">View Store</p>
              <p className="text-gray-500 text-sm">See the public storefront</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
