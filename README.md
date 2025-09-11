# E-Commerce Platform

A full-stack e-commerce platform built with React, Node.js, PostgreSQL, and Stripe. Features include user authentication, product management, shopping cart, and payment processing.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX** - Built with React 18 and Tailwind CSS
- **Responsive Design** - Mobile-first approach with responsive layouts
- **State Management** - Zustand for client-side state management
- **Routing** - React Router for navigation
- **Forms** - React Hook Form for form handling
- **Notifications** - React Hot Toast for user feedback
- **HTTP Client** - Axios for API communication

### Backend (Node.js)
- **RESTful API** - Express.js server with organized routes
- **Authentication** - JWT-based authentication with bcrypt password hashing
- **Database** - PostgreSQL with connection pooling
- **Validation** - Express Validator for request validation
- **Security** - Helmet, CORS, and rate limiting
- **File Upload** - Multer for handling file uploads

### Payment Processing
- **Stripe Integration** - Secure payment processing
- **Payment Intents** - Modern payment flow with Stripe Elements
- **Webhook Support** - Ready for webhook integration

### Admin Features
- **Dashboard** - Overview of orders, products, and users
- **Product Management** - CRUD operations for products
- **Order Management** - View and update order status
- **User Management** - Manage user roles and permissions

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Zustand
- React Query
- React Hook Form
- React Hot Toast
- Axios
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- Bcrypt
- Stripe
- Express Validator
- Multer
- Helmet
- CORS

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e-commerce-platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE ecommerce;
```

2. Update the database configuration in `server/env.example` and rename it to `.env`:
```bash
cd server
cp env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
PORT=5000
NODE_ENV=development
```

4. Set up the database tables:
```bash
cd server
npm run db:setup
```

### 4. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Update the `.env` file with your Stripe keys
4. Update the client-side Stripe key in `client/src/pages/Checkout.js`

### 5. Environment Variables

Create a `.env` file in the client directory:
```bash
cd client
touch .env
```

Add the following:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 🏃‍♂️ Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
# From the root directory
npm run dev
```

Or run them separately:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start the backend:
```bash
cd server
npm start
```

## 📁 Project Structure

```
e-commerce-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API routes
│   ├── scripts/          # Database setup scripts
│   ├── package.json
│   └── ...
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories/all` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/create` - Create order
- `POST /api/orders/create-payment-intent` - Create payment intent
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Users
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/all` - Get all users (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)

## 🎨 Features Overview

### User Features
- **Registration & Login** - Secure user authentication
- **Product Browsing** - Search, filter, and browse products
- **Shopping Cart** - Add/remove items, quantity management
- **Checkout** - Secure payment processing with Stripe
- **Order History** - View past orders and status
- **Profile Management** - Update personal information

### Admin Features
- **Dashboard** - Overview of platform statistics
- **Product Management** - Add, edit, delete products
- **Order Management** - View and update order status
- **User Management** - Manage user roles and permissions

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet security headers
- SQL injection prevention

## 🧪 Testing

To run tests (when implemented):
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🚀 Deployment

### Easy Deployment with Vercel + Neon

This project is optimized for easy deployment using Vercel (hosting) and Neon (database). See the detailed deployment guide:

📖 **[VERCEL_NEON_DEPLOYMENT.md](./VERCEL_NEON_DEPLOYMENT.md)** - Complete step-by-step deployment guide

### Quick Deploy Steps

1. **Database**: Set up PostgreSQL with [Neon](https://neon.tech) (free tier available)
2. **Backend**: Deploy to [Vercel](https://vercel.com) with root directory `server`
3. **Frontend**: Deploy to [Vercel](https://vercel.com) with root directory `client`
4. **Environment Variables**: Configure as per the deployment guide

### Alternative Deployment Options

- **Backend**: Heroku, AWS, DigitalOcean
- **Database**: AWS RDS, Heroku Postgres, Supabase
- **Frontend**: Netlify, AWS S3, GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced payment options
- [ ] Order tracking system

---

**Happy Coding! 🎉**
