/**
 * Product Detail Page
 * Displays full product information with add to cart functionality
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  StarIcon, 
  MinusIcon, 
  PlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/solid';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useCountry } from '../context/CountryContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { formatPrice } = useCountry();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);

        // Fetch related products
        if (data.product.category?._id) {
          const relatedRes = await api.get(`/products?category=${data.product.category._id}&limit=4`);
          setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted successfully');
      // Refresh product
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images 
    : [{ url: 'https://placehold.co/600x400/1e293b/9b59b6?text=No+Image' }];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary-400 mb-8 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="glass-card overflow-hidden aspect-square">
              <img
                src={images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/1e293b/9b59b6?text=No+Image';
                }}
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                              ${selectedImage === index ? 'border-primary-500' : 'border-transparent hover:border-dark-500'}`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category Badge */}
            <span className="badge-primary mb-4">
              {product.category?.name || 'Uncategorized'}
            </span>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>

            {/* Country & Seller */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-xl">
                  {product.country === 'Algeria' && '🇩🇿'}
                  {product.country === 'Tunisia' && '🇹🇳'}
                  {product.country === 'Italy' && '🇮🇹'}
                </span>
                <span>{product.country}</span>
              </div>
              {product.seller && (
                <div className="text-gray-400">
                  by <span className="text-primary-400">{product.seller.storeName || product.seller.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="badge-success">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                </span>
              ) : (
                <span className="badge-danger">Out of Stock</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-2 bg-dark-800 rounded-xl p-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MinusIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <PlusIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 flex items-center space-x-3">
                <TruckIcon className="w-6 h-6 text-primary-400" />
                <div>
                  <p className="text-white font-medium text-sm">Free Shipping</p>
                  <p className="text-gray-500 text-xs">On orders over €100</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-primary-400" />
                <div>
                  <p className="text-white font-medium text-sm">Secure Payment</p>
                  <p className="text-gray-500 text-xs">100% protected</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <div className="glass-card p-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-dark-700 last:border-0">
                      <span className="text-gray-400">{spec.key}</span>
                      <span className="text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white mb-6">Customer Reviews</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Review Form */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1"
                        >
                          <StarIcon
                            className={`w-8 h-8 transition-colors ${
                              star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="input-field h-32 resize-none"
                      placeholder="Share your experience with this product..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary w-full"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Please login to write a review</p>
                  <Link to="/login" className="btn-primary">Login</Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div key={index} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                          <span className="text-primary-400 font-semibold">
                            {review.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{review.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="glass-card p-8 text-center">
                  <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
