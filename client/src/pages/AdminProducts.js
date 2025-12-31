/**
 * Admin Products Page
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  TrashIcon, 
  StarIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import api from '../utils/api';
import { useCountry } from '../context/CountryContext';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const { formatPrice } = useCountry();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/admin/products');
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleToggleFeatured = async (productId) => {
    try {
      const { data } = await api.put(`/admin/products/${productId}/feature`);
      setProducts(products.map(p => 
        p._id === productId ? { ...p, featured: data.featured } : p
      ));
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const { data } = await api.put(`/admin/products/${productId}/status`);
      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: data.isActive } : p
      ));
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Manage Products</h1>
            <p className="text-gray-400 mt-1">{products.length} products total</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Seller</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Country</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images?.[0]?.url || 'https://placehold.co/80x80/1e293b/9b59b6?text=No+Image'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-500 text-sm">{product.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400">{product.seller?.name}</p>
                      <p className="text-gray-500 text-xs">{product.seller?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{formatPrice(product.price, product.currency)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        product.stock > 10 ? 'badge-success' :
                        product.stock > 0 ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">
                        {product.country === 'Algeria' && '🇩🇿'}
                        {product.country === 'Tunisia' && '🇹🇳'}
                        {product.country === 'Italy' && '🇮🇹'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.featured && (
                          <span className="badge-primary">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleToggleFeatured(product._id)}
                          className={`p-2 transition-colors ${
                            product.featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={product.featured ? 'Remove from Featured' : 'Add to Featured'}
                        >
                          {product.featured ? (
                            <StarSolidIcon className="w-5 h-5" />
                          ) : (
                            <StarIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product._id)}
                          className={`p-2 transition-colors ${
                            product.isActive ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'
                          }`}
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {product.isActive ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            <XCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
