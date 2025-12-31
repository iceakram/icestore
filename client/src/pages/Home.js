/**
 * Home Page
 * Landing page with hero, featured products, and categories
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, GlobeAltIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useCountry, COUNTRIES } from '../context/CountryContext';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';

const Home = () => {
  const { selectedCountry } = useCountry();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get(`/products/featured?limit=8&country=${selectedCountry.name}`),
          api.get('/categories')
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  const features = [
    {
      icon: GlobeAltIcon,
      title: '3 Countries',
      description: 'Shop from Algeria, Tunisia, and Italy'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Quick shipping across the Mediterranean'
    },
    {
      icon: SparklesIcon,
      title: 'Premium Quality',
      description: 'Curated products from verified sellers'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-900 to-dark-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5YjU5YjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-6 animate-fadeIn">
              <SparklesIcon className="w-5 h-5 text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">Premium Mediterranean Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">Shop Premium Products</span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Across the Mediterranean
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Discover unique products from Algeria, Tunisia, and Italy. 
              Quality guaranteed, delivered to your doorstep.
            </p>

            {/* Country Flags */}
            <div className="flex items-center justify-center space-x-6 mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              {COUNTRIES.map((country) => (
                <div 
                  key={country.code}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all
                            ${selectedCountry.code === country.code 
                              ? 'bg-primary-500/20 border border-primary-500/50' 
                              : 'bg-dark-800/50 border border-dark-700'}`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-gray-300">{country.name}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Link to="/products" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group">
                <span>Explore Products</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register?role=seller" className="btn-secondary text-lg px-8 py-4">
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 text-center hover:border-primary-500/30 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked items from {selectedCountry.name}</p>
            </div>
            <Link to="/products?featured=true" className="btn-ghost flex items-center space-x-2 group">
              <span>View All</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No featured products available in {selectedCountry.name}</p>
              <Link to="/products" className="btn-primary mt-4 inline-block">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="glass-card-hover p-6 text-center group"
                >
                  <div className="text-4xl mb-3">{category.icon || '📦'}</div>
                  <h3 className="text-white font-semibold group-hover:text-primary-300 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to Start Selling?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join our community of sellers and reach customers across Algeria, Tunisia, and Italy. 
                Easy setup, powerful tools, and dedicated support.
              </p>
              <Link to="/register?role=seller" className="btn-primary text-lg px-8 py-4">
                Create Your Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
