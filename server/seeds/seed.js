/**
 * Database Seeder
 * Populates database with initial data for development/testing
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/icestore');

// Sample data
const categories = [
  { name: 'Electronics', description: 'Smartphones, laptops, tablets, and accessories', icon: '📱' },
  { name: 'Clothing', description: 'Fashion apparel for men and women', icon: '👕' },
  { name: 'Accessories', description: 'Watches, jewelry, bags, and more', icon: '⌚' },
  { name: 'Digital', description: 'Software, games, and digital downloads', icon: '💿' },
  { name: 'Home & Living', description: 'Furniture, decor, and home essentials', icon: '🏠' },
  { name: 'Beauty', description: 'Skincare, makeup, and personal care', icon: '💄' },
  { name: 'Sports', description: 'Sports equipment and fitness gear', icon: '⚽' },
  { name: 'Books', description: 'Books, magazines, and educational materials', icon: '📚' }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@icestore.com',
    password: 'admin123',
    role: 'admin',
    country: 'Italy',
    isApproved: true
  },
  {
    name: 'Tech Store',
    email: 'seller1@icestore.com',
    password: 'seller123',
    role: 'seller',
    country: 'Italy',
    storeName: 'TechHub Italia',
    storeDescription: 'Your premium destination for the latest electronics and gadgets',
    isApproved: true
  },
  {
    name: 'Fashion Boutique',
    email: 'seller2@icestore.com',
    password: 'seller123',
    role: 'seller',
    country: 'Tunisia',
    storeName: 'Mode Tunisienne',
    storeDescription: 'Trendy fashion and accessories from Tunisia',
    isApproved: true
  },
  {
    name: 'Digital Dreams',
    email: 'seller3@icestore.com',
    password: 'seller123',
    role: 'seller',
    country: 'Algeria',
    storeName: 'Digital Dreams DZ',
    storeDescription: 'Software, games, and digital products',
    isApproved: true
  },
  {
    name: 'John Buyer',
    email: 'buyer@icestore.com',
    password: 'buyer123',
    role: 'buyer',
    country: 'Italy',
    isApproved: true
  }
];

// Sample products (will be linked to categories and sellers)
const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system. Experience the future of smartphones.',
    price: 1299,
    currency: 'EUR',
    country: 'Italy',
    stock: 50,
    featured: true,
    categoryIndex: 0,
    sellerIndex: 1,
    tags: ['apple', 'smartphone', 'premium'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=iPhone+15+Pro', public_id: 'iphone15' }]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android flagship with S Pen, 200MP camera, and AI-powered features.',
    price: 1199,
    currency: 'EUR',
    country: 'Italy',
    stock: 30,
    featured: true,
    categoryIndex: 0,
    sellerIndex: 1,
    tags: ['samsung', 'smartphone', 'android'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Galaxy+S24', public_id: 'samsung' }]
  },
  {
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop with M3 Pro chip, stunning Liquid Retina display, and all-day battery life.',
    price: 2499,
    currency: 'EUR',
    country: 'Italy',
    stock: 20,
    featured: true,
    categoryIndex: 0,
    sellerIndex: 1,
    tags: ['apple', 'laptop', 'macbook'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=MacBook+Pro', public_id: 'macbook' }]
  },
  {
    name: 'Designer Leather Jacket',
    description: 'Premium genuine leather jacket with modern cut. Perfect for any occasion.',
    price: 299,
    currency: 'TND',
    country: 'Tunisia',
    stock: 40,
    featured: true,
    categoryIndex: 1,
    sellerIndex: 2,
    tags: ['leather', 'jacket', 'fashion'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Leather+Jacket', public_id: 'jacket' }]
  },
  {
    name: 'Traditional Tunisian Dress',
    description: 'Elegant traditional dress with intricate embroidery. Handmade by local artisans.',
    price: 450,
    currency: 'TND',
    country: 'Tunisia',
    stock: 25,
    featured: false,
    categoryIndex: 1,
    sellerIndex: 2,
    tags: ['traditional', 'dress', 'handmade'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Traditional+Dress', public_id: 'dress' }]
  },
  {
    name: 'Silk Scarf Collection',
    description: 'Luxurious silk scarves with unique Mediterranean patterns.',
    price: 89,
    currency: 'TND',
    country: 'Tunisia',
    stock: 100,
    featured: true,
    categoryIndex: 2,
    sellerIndex: 2,
    tags: ['silk', 'scarf', 'accessory'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Silk+Scarf', public_id: 'scarf' }]
  },
  {
    name: 'Adobe Creative Suite License',
    description: '1-year subscription to Adobe Creative Cloud with all apps included.',
    price: 55000,
    currency: 'DZD',
    country: 'Algeria',
    stock: 999,
    featured: true,
    categoryIndex: 3,
    sellerIndex: 3,
    tags: ['adobe', 'software', 'creative'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Adobe+CC', public_id: 'adobe' }]
  },
  {
    name: 'Gaming Bundle - 10 Games',
    description: 'Collection of 10 popular PC games including action, RPG, and strategy titles.',
    price: 25000,
    currency: 'DZD',
    country: 'Algeria',
    stock: 500,
    featured: false,
    categoryIndex: 3,
    sellerIndex: 3,
    tags: ['games', 'pc', 'bundle'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Gaming+Bundle', public_id: 'games' }]
  },
  {
    name: 'Microsoft Office 365',
    description: 'Complete productivity suite with Word, Excel, PowerPoint, and more. 1-year license.',
    price: 35000,
    currency: 'DZD',
    country: 'Algeria',
    stock: 999,
    featured: true,
    categoryIndex: 3,
    sellerIndex: 3,
    tags: ['microsoft', 'office', 'productivity'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Office+365', public_id: 'office' }]
  },
  {
    name: 'AirPods Pro 2',
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
    price: 279,
    currency: 'EUR',
    country: 'Italy',
    stock: 75,
    featured: true,
    categoryIndex: 2,
    sellerIndex: 1,
    tags: ['apple', 'earbuds', 'audio'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=AirPods+Pro', public_id: 'airpods' }]
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
    price: 399,
    currency: 'EUR',
    country: 'Italy',
    stock: 45,
    featured: true,
    categoryIndex: 2,
    sellerIndex: 1,
    tags: ['smartwatch', 'fitness', 'wearable'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Smart+Watch', public_id: 'watch' }]
  },
  {
    name: 'Professional Camera Kit',
    description: 'Full-frame mirrorless camera with 24-70mm lens and accessories.',
    price: 2899,
    currency: 'EUR',
    country: 'Italy',
    stock: 15,
    featured: false,
    categoryIndex: 0,
    sellerIndex: 1,
    tags: ['camera', 'photography', 'professional'],
    images: [{ url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Camera+Kit', public_id: 'camera' }]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create users with hashed passwords
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products
    const productData = products.map(product => ({
      ...product,
      category: createdCategories[product.categoryIndex]._id,
      seller: createdUsers[product.sellerIndex]._id
    }));

    const createdProducts = await Product.insertMany(productData.map(p => {
      const { categoryIndex, sellerIndex, ...rest } = p;
      return rest;
    }));
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Test Accounts:');
    console.log('   Admin: admin@icestore.com / admin123');
    console.log('   Seller: seller1@icestore.com / seller123');
    console.log('   Buyer: buyer@icestore.com / buyer123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
