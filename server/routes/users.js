/**
 * Users Routes
 * Handles user-related operations
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/users/sellers
 * @desc    Get all approved sellers
 * @access  Public
 */
router.get('/sellers', async (req, res) => {
  try {
    const { country, page = 1, limit = 10 } = req.query;
    const query = { role: 'seller', isApproved: true };
    
    if (country) query.country = country;

    const sellers = await User.find(query)
      .select('name storeName storeDescription country avatar createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      sellers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/users/seller/:id
 * @desc    Get seller profile
 * @access  Public
 */
router.get('/seller/:id', async (req, res) => {
  try {
    const seller = await User.findOne({ 
      _id: req.params.id, 
      role: 'seller',
      isApproved: true 
    }).select('name storeName storeDescription country avatar createdAt');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      seller
    });
  } catch (error) {
    console.error('Get seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/users/stats
 * @desc    Get seller statistics
 * @access  Private (Seller only)
 */
router.get('/stats', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const Product = require('../models/Product');
    const Order = require('../models/Order');

    // Get product count
    const productCount = await Product.countDocuments({ seller: req.user.id });
    
    // Get orders with seller's products
    const orders = await Order.find({ 'items.seller': req.user.id });
    
    // Calculate stats
    let totalSales = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.seller.toString() === req.user.id);
      const orderRevenue = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      totalSales += sellerItems.reduce((acc, item) => acc + item.quantity, 0);
      totalRevenue += orderRevenue;
      
      if (order.status === 'delivered') completedOrders++;
      else if (!['cancelled'].includes(order.status)) pendingOrders++;
    });

    res.json({
      success: true,
      stats: {
        productCount,
        totalSales,
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
