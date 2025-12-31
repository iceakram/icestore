/**
 * Order Success Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon, TruckIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import api from '../utils/api';
import { useCountry } from '../context/CountryContext';
import Loading from '../components/common/Loading';

const OrderSuccess = () => {
  const { id } = useParams();
  const { formatPrice } = useCountry();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Order not found</h2>
          <Link to="/orders" className="btn-primary">View Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center animate-fadeIn">
            <CheckCircleIcon className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Order Confirmed!
          </h1>
          <p className="text-gray-400 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details Card */}
        <div className="glass-card p-6 mb-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-dark-700">
            <div>
              <p className="text-gray-400 text-sm">Order Number</p>
              <p className="text-white font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Date</p>
              <p className="text-white font-semibold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl mb-6">
            <TruckIcon className="w-6 h-6 text-primary-400" />
            <div>
              <p className="text-white font-medium">Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
              <p className="text-gray-400 text-sm">We'll notify you when your order ships</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
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
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-400">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}<br />
              {order.shippingAddress.phone}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-dark-700 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsTotal, order.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost, order.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span>{formatPrice(order.tax, order.currency)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-dark-700">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount, order.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Confirmation Note */}
        <div className="glass-card p-4 flex items-center space-x-3 mb-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <EnvelopeIcon className="w-6 h-6 text-primary-400" />
          <p className="text-gray-400">
            A confirmation email has been sent to your email address
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <Link to="/orders" className="btn-secondary flex-1 text-center">
            View All Orders
          </Link>
          <Link to="/products" className="btn-primary flex-1 text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
