# icestore ❄️

> Premium E-Commerce Platform for Algeria, Tunisia & Italy

![icestore](https://placehold.co/800x400/1e293b/9b59b6?text=icestore+-+Premium+E-Commerce)

## 🌟 Overview

icestore is a modern, production-ready e-commerce platform designed for buying and selling products across Algeria, Tunisia, and Italy. Built with a premium dark theme featuring deep purple and black colors.

### ✨ Features

- **Multi-Country Support**: Algeria (DZD), Tunisia (TND), Italy (EUR)
- **User Roles**: Buyers, Sellers (with approval), Admins
- **Product Management**: Full CRUD with images, categories, reviews
- **Shopping Experience**: Cart, checkout, order tracking
- **Dashboards**: Buyer orders, Seller analytics, Admin panel
- **Email Notifications**: Order confirmations via Nodemailer
- **Premium UI**: Glassmorphism, animations, dark theme

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - API server
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI framework
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📁 Project Structure

```
icestore/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── products/
│   │   ├── context/        # React Context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities (API, etc.)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                 # Node.js backend
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, upload middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seeds/              # Database seeders
│   ├── utils/              # Email, helpers
│   ├── index.js            # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iceakram/icestore.git
   cd icestore
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/icestore

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=icestore <noreply@icestore.com>
ADMIN_EMAIL=akrammah39@gmail.com

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Seed the Database** (optional)
   ```bash
   cd server
   npm run seed
   ```

3. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```

4. **Start Frontend** (new terminal)
   ```bash
   cd client
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 Test Accounts

After running the seeder, use these accounts:

| Role   | Email                    | Password   |
|--------|--------------------------|------------|
| Admin  | admin@icestore.com       | admin123   |
| Seller | seller1@icestore.com     | seller123  |
| Buyer  | buyer@icestore.com       | buyer123   |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/reviews` - Add review

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/seller` - Get seller orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/sellers/:id/approve` - Approve seller
- `PUT /api/admin/products/:id/feature` - Toggle featured

## 🎨 Design System

### Colors
- **Primary**: Deep Purple (#9b59b6, #7c3aed)
- **Background**: Dark (#0f172a, #1e293b)
- **Accent**: Neon Purple (#a855f7)

### Components
- Glassmorphism cards with blur effects
- Gradient buttons with glow effects
- Smooth hover animations
- Dark mode by default

## 📱 Responsive Design

The application is fully responsive with mobile-first design:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- Role-based access control
- CORS configuration

## 🚢 Deployment

### Backend (Heroku/Railway/Render)
```bash
cd server
# Set environment variables on platform
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy build folder
```

### Environment Setup
1. Set `REACT_APP_API_URL` to your backend URL
2. Configure MongoDB Atlas connection string
3. Set up email service credentials

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**icestore** - Premium Mediterranean E-Commerce

---

Built with ❤️ using React, Node.js, and MongoDB