/**
 * Add/Edit Product Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES } from '../context/CountryContext';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'EUR',
    category: '',
    stock: '',
    country: user?.country || 'Italy',
    tags: '',
    images: []
  });

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

  // Fetch product if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditing) return;
      try {
        const { data } = await api.get(`/products/${id}`);
        const product = data.product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          currency: product.currency,
          category: product.category?._id || '',
          stock: product.stock.toString(),
          country: product.country,
          tags: product.tags?.join(', ') || '',
          images: product.images || []
        });
      } catch (error) {
        toast.error('Product not found');
        navigate('/seller/products');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrencyForCountry = (country) => {
    const countryData = COUNTRIES.find(c => c.name === country);
    return countryData?.currency || 'EUR';
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData({
      ...formData,
      country,
      currency: getCurrencyForCountry(country)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        stock: parseInt(formData.stock),
        country: formData.country,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: formData.images
      };

      if (isEditing) {
        await api.put(`/products/${id}`, productData);
        toast.success('Product updated successfully');
      } else {
        const { data } = await api.post('/products', productData);
        toast.success('Product created successfully');
        // Navigate to product page
        navigate(`/products/${data.product._id}`);
      }
      
      navigate('/seller/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, { url: url.trim(), public_id: Date.now().toString() }]
      });
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/seller/products" className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-6 transition-colors">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Products
        </Link>

        <h1 className="text-3xl font-display font-bold text-white mb-8">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="glass-card p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="input-field h-32 resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      required
                      className="input-field"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-xs mt-1">Based on country</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Product Images</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="w-full h-24 border-2 border-dashed border-dark-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-400 transition-colors"
                >
                  <PhotoIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs">Add Image URL</span>
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Tip: Use placeholder images from placehold.co for testing (e.g., https://placehold.co/600x400)
              </p>
            </div>

            {/* Tags */}
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter tags separated by commas (e.g., electronics, smartphone, apple)"
              />
              <p className="text-gray-500 text-xs mt-2">
                Tags help customers find your products through search
              </p>
            </div>

            {/* Submit */}
            <div className="border-t border-dark-700 pt-6 flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/seller/products')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  isEditing ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
