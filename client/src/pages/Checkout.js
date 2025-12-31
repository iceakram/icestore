/**
 * Checkout Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TruckIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon,
  ChevronLeftIcon 
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, subtotal, currency, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCountry();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.country || '',
    phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [notes, setNotes] = useState('');

  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map(({ product, quantity }) => ({
          product: product._id,
          quantity
        })),
        shippingAddress,
        paymentMethod,
        notes
      };

      const { data } = await api.post('/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Add some products to checkout.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-6 transition-colors">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-display font-bold text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <TruckIcon className="w-6 h-6 text-primary-400" />
                  <h2 className="text-xl font-semibold text-white">Shipping Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Rome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Lazio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="00100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Country</label>
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Country</option>
                      <option value="Algeria">🇩🇿 Algeria</option>
                      <option value="Tunisia">🇹🇳 Tunisia</option>
                      <option value="Italy">🇮🇹 Italy</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCardIcon className="w-6 h-6 text-primary-400" />
                  <h2 className="text-xl font-semibold text-white">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all
                                    ${paymentMethod === 'cash_on_delivery' 
                                      ? 'border-primary-500 bg-primary-500/10' 
                                      : 'border-dark-600 hover:border-dark-500'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <BanknotesIcon className="w-6 h-6 text-gray-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">Cash on Delivery</p>
                      <p className="text-gray-500 text-sm">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all
                                    ${paymentMethod === 'bank_transfer' 
                                      ? 'border-primary-500 bg-primary-500/10' 
                                      : 'border-dark-600 hover:border-dark-500'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <BuildingLibraryIcon className="w-6 h-6 text-gray-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">Bank Transfer</p>
                      <p className="text-gray-500 text-sm">Pay via bank transfer</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all
                                    ${paymentMethod === 'credit_card' 
                                      ? 'border-primary-500 bg-primary-500/10' 
                                      : 'border-dark-600 hover:border-dark-500'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <CreditCardIcon className="w-6 h-6 text-gray-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">Credit/Debit Card</p>
                      <p className="text-gray-500 text-sm">Secure online payment</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Order Notes (Optional)</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field h-24 resize-none"
                  placeholder="Special instructions for delivery..."
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center space-x-3">
                      <img
                        src={product.images?.[0]?.url || 'https://placehold.co/80x80/1e293b/9b59b6?text=No+Image'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{product.name}</p>
                        <p className="text-gray-500 text-xs">x{quantity}</p>
                      </div>
                      <p className="text-white text-sm">
                        {formatPrice(product.price * quantity, product.currency)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-dark-700 pt-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost, currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax, currency)}</span>
                  </div>
                  <div className="border-t border-dark-700 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total, currency)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    `Place Order - ${formatPrice(total, currency)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
