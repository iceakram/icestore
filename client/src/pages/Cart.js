/**
 * Cart Page
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, itemCount, subtotal, currency, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCountry();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else if (newQuantity <= maxStock) {
      updateQuantity(productId, newQuantity);
    } else {
      toast.error('Cannot exceed available stock');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  // Calculate shipping and tax
  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <ShoppingBagIcon className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="glass-card p-4 flex gap-4">
                {/* Image */}
                <Link to={`/products/${product._id}`} className="flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || 'https://placehold.co/200x200/1e293b/9b59b6?text=No+Image'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link 
                    to={`/products/${product._id}`}
                    className="text-white font-semibold hover:text-primary-400 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">
                    {product.category?.name || 'Uncategorized'} • {product.country}
                  </p>
                  <p className="text-primary-400 font-bold mt-2">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 bg-dark-800 rounded-lg p-1">
                    <button
                      onClick={() => handleQuantityChange(product._id, quantity - 1, product.stock)}
                      className="p-1 hover:bg-dark-700 rounded transition-colors"
                    >
                      <MinusIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="w-8 text-center text-white text-sm">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, quantity + 1, product.stock)}
                      className="p-1 hover:bg-dark-700 rounded transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-white font-semibold">
                    {formatPrice(product.price * quantity, product.currency)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      removeFromCart(product._id);
                      toast.success('Removed from cart');
                    }}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
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

              {subtotal < 100 && (
                <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3 mb-4">
                  <p className="text-primary-300 text-sm">
                    Add {formatPrice(100 - subtotal, currency)} more for free shipping!
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="btn-primary w-full"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-gray-400 hover:text-primary-400 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
