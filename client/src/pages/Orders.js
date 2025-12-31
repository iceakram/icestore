/**
 * Orders Page - Buyer's order history
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useCountry } from '../context/CountryContext';
import Loading from '../components/common/Loading';

const Orders = () => {
  const { formatPrice } = useCountry();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = filter ? `?status=${filter}` : '';
        const { data } = await api.get(`/orders${params}`);
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'confirmed':
      case 'processing':
        return <ShoppingBagIcon className="w-5 h-5 text-blue-400" />;
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-purple-400" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-500/20 text-blue-300';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'bg-gray-500/20 text-gray-300';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-white mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all
                        ${filter === status
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="glass-card p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-dark-700">
                  <div>
                    <p className="text-gray-400 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-white font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                    {getStatusIcon(order.status)}
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={item.image || 'https://placehold.co/80x80/1e293b/9b59b6?text=No+Image'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white">{item.name}</p>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white">
                        {formatPrice(item.price * item.quantity, order.currency)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-gray-500 text-sm">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-white font-bold text-lg">
                      {formatPrice(order.totalAmount, order.currency)}
                    </p>
                  </div>
                  <Link
                    to={`/order-success/${order._id}`}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBagIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400 mb-6">
              {filter ? `No ${filter} orders yet` : "You haven't placed any orders yet"}
            </p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
