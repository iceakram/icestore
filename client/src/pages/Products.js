/**
 * Products Page
 * Product listing with filters and search
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import { COUNTRIES } from '../context/CountryContext';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Get filters from URL
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    country: searchParams.get('country') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const country = searchParams.get('country') || '';
        const minPrice = searchParams.get('minPrice') || '';
        const maxPrice = searchParams.get('maxPrice') || '';
        const featured = searchParams.get('featured') || '';
        const sort = searchParams.get('sort') || '-createdAt';
        const page = parseInt(searchParams.get('page')) || 1;

        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (country) params.append('country', country);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (featured) params.append('featured', featured);
        params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 12);

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Update filters
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.country || filters.minPrice || filters.maxPrice || filters.featured;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              {filters.search ? `Results for "${filters.search}"` : 'All Products'}
            </h1>
            <p className="text-gray-400 mt-1">
              {pagination.total || 0} products found
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden btn-secondary flex items-center space-x-2"
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${filtersOpen ? 'fixed inset-0 z-50 lg:relative lg:z-auto' : 'hidden lg:block'}`}>
            {/* Mobile Overlay */}
            {filtersOpen && (
              <div 
                className="lg:hidden absolute inset-0 bg-black/50"
                onClick={() => setFiltersOpen(false)}
              />
            )}

            {/* Filter Content */}
            <div className={`${filtersOpen ? 'absolute right-0 top-0 h-full w-80 bg-dark-900 p-6 overflow-y-auto' : ''} lg:relative lg:w-full`}>
              {filtersOpen && (
                <div className="lg:hidden flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)}>
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              )}

              <div className="glass-card p-6 space-y-6">
                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-primary-400 text-sm hover:text-primary-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}

                {/* Category Filter */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateFilter('category', '')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors
                                ${!filters.category ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:bg-dark-700'}`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => updateFilter('category', category._id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors
                                  ${filters.category === category._id ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:bg-dark-700'}`}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country Filter */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Country</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateFilter('country', '')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors
                                ${!filters.country ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:bg-dark-700'}`}
                    >
                      All Countries
                    </button>
                    {COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => updateFilter('country', country.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2
                                  ${filters.country === country.name ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:bg-dark-700'}`}
                      >
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Price Range</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="input-field w-full text-sm py-2"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="input-field w-full text-sm py-2"
                    />
                  </div>
                </div>

                {/* Featured Only */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featured === 'true'}
                      onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                      className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Featured Only</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="input-field py-2 px-3 text-sm w-auto"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-rating">Best Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center mt-12 space-x-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => updateFilter('page', page.toString())}
                        className={`w-10 h-10 rounded-lg font-medium transition-all
                                  ${pagination.page === page 
                                    ? 'bg-primary-500 text-white' 
                                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
