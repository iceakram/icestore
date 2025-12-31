/**
 * Seller Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClockIcon,
  ArrowUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useCountry } from '../context/CountryContext';
import Loading from '../components/common/Loading';

const SellerDashboard = () => {
  const { formatPrice } = useCountry();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/orders/seller?limit=5')
        ]);
        setStats(statsRes.data.stats);
        setRecentOrders(ordersRes.data.orders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0, 'EUR'),
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Sales',
      value: stats?.totalSales || 0,
      icon: ShoppingBagIcon,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Products',
      value: stats?.productCount || 0,
      icon: CubeIcon,
      color: 'from-purple-500 to-primary-600'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: ClockIcon,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Seller Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's your store overview</p>
          </div>
          <Link to="/seller/products/add" className="btn-primary flex items-center space-x-2">
            <PlusIcon className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <Link to="/orders/seller" className="text-primary-400 hover:text-primary-300 text-sm">
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                    <div>
                      <p className="text-white font-medium">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {order.user?.name || 'Customer'}
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

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                to="/seller/products"
                className="flex items-center p-4 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors"
              >
                <CubeIcon className="w-8 h-8 text-primary-400 mr-4" />
                <div>
                  <p className="text-white font-medium">Manage Products</p>
                  <p className="text-gray-500 text-sm">Edit, update, or remove your products</p>
                </div>
              </Link>
              
              <Link
                to="/seller/products/add"
                className="flex items-center p-4 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors"
              >
                <PlusIcon className="w-8 h-8 text-green-400 mr-4" />
                <div>
                  <p className="text-white font-medium">Add New Product</p>
                  <p className="text-gray-500 text-sm">List a new product for sale</p>
                </div>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center p-4 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors"
              >
                <ArrowUpIcon className="w-8 h-8 text-blue-400 mr-4" />
                <div>
                  <p className="text-white font-medium">Update Store Profile</p>
                  <p className="text-gray-500 text-sm">Edit your store information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
