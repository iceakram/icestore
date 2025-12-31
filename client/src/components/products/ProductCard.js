/**
 * Product Card Component
 * Displays product information in a card format
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { useCountry } from '../../context/CountryContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCountry();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  const imageUrl = product.images?.[0]?.url || 'https://placehold.co/600x400/1e293b/9b59b6?text=No+Image';

  return (
    <Link to={`/products/${product._id}`} className="product-card block group">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card-image"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400/1e293b/9b59b6?text=No+Image';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="badge-primary">Featured</span>
          )}
          {product.stock <= 0 && (
            <span className="badge-danger">Out of Stock</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="badge-warning">Low Stock</span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`absolute bottom-3 right-3 p-3 rounded-xl transition-all duration-300 transform translate-y-2 opacity-0 
                    group-hover:translate-y-0 group-hover:opacity-100
                    ${product.stock > 0 
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow' 
                      : 'bg-dark-600 text-gray-400 cursor-not-allowed'}`}
        >
          <ShoppingCartIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
          {product.category?.name || 'Uncategorized'}
        </span>
        
        {/* Name */}
        <h3 className="mt-1 text-lg font-semibold text-white line-clamp-1 group-hover:text-primary-300 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center mt-2 space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-400">
              {product.rating} ({product.numReviews})
            </span>
          </div>
        )}

        {/* Price and Country */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-sm text-gray-500">
            {product.country === 'Algeria' && '🇩🇿'}
            {product.country === 'Tunisia' && '🇹🇳'}
            {product.country === 'Italy' && '🇮🇹'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
