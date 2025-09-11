# Vercel + Neon Deployment Guide

This guide will help you deploy the e-commerce platform using Vercel for hosting and Neon for the PostgreSQL database.

## 🚀 Quick Setup

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Neon account (free tier available)
- Stripe account (for payments)

## 📊 Database Setup with Neon

### 1. Create Neon Database

1. **Sign up for Neon**
   - Visit [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project

2. **Get Connection Details**
   - Copy the connection string from your Neon dashboard
   - It will look like: `postgresql://username:password@hostname/database?sslmode=require`

3. **Set up Database Schema**
   - Use the Neon SQL editor or connect with a PostgreSQL client
   - Run the SQL from `server/scripts/setup-db.js` to create tables

## 🖥️ Backend Deployment (Vercel)

### 1. Deploy Backend to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Backend**
   - Set **Root Directory** to `server`
   - Vercel will auto-detect it's a Node.js project

3. **Set Environment Variables**
   In your Vercel project settings, add these environment variables:

   ```env
   NODE_ENV=production
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=your-super-secret-jwt-key-for-production
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your backend

### 2. Test Backend

1. **Check Health Endpoint**
   ```
   https://your-backend-name.vercel.app/health
   ```

2. **Test API Endpoints**
   ```
   https://your-backend-name.vercel.app/api/health
   ```

## 🎨 Frontend Deployment (Vercel)

### 1. Deploy Frontend

1. **Create New Vercel Project**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import the same GitHub repository

2. **Configure Frontend**
   - Set **Root Directory** to `client`
   - Vercel will auto-detect it's a React project

3. **Set Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-name.vercel.app/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be available at `https://your-frontend-name.vercel.app`

## 🔧 Database Schema Setup

After deploying your backend, you need to set up the database schema:

### Option 1: Using Neon SQL Editor
1. Go to your Neon dashboard
2. Open the SQL Editor
3. Run the following SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    shipping_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, stock_quantity, category) VALUES
('Sample Product 1', 'This is a sample product description', 29.99, 'https://via.placeholder.com/300x200', 10, 'Electronics'),
('Sample Product 2', 'Another sample product', 49.99, 'https://via.placeholder.com/300x200', 5, 'Clothing'),
('Sample Product 3', 'Third sample product', 19.99, 'https://via.placeholder.com/300x200', 15, 'Books');
```

### Option 2: Using the Setup Script
1. Clone your repository locally
2. Install dependencies: `cd server && npm install`
3. Set up environment variables in `.env` file
4. Run: `npm run db:setup`

## 🔐 Environment Variables Reference

### Backend (Vercel)
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
JWT_SECRET=your-jwt-secret-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Production Considerations

### Security
- Use strong JWT secrets (32+ characters)
- Enable HTTPS (automatic on Vercel)
- Use production Stripe keys when ready
- Set up proper CORS policies

### Performance
- Neon provides connection pooling automatically
- Vercel handles CDN and edge functions
- Monitor database usage in Neon dashboard
- Use Vercel Analytics for frontend monitoring

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times in Vercel
- Track database performance in Neon
- Set up uptime monitoring

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify `DATABASE_URL` is correctly set
   - Check that Neon database is active
   - Ensure SSL is enabled for production

2. **CORS Issues**
   - Verify `CLIENT_URL` matches your frontend URL
   - Check CORS configuration in backend

3. **Stripe Issues**
   - Verify Stripe keys are correct
   - Check webhook endpoints if using them

4. **Build Failures**
   - Check Vercel build logs
   - Verify all dependencies are in package.json
   - Ensure environment variables are set

### Debug Steps

1. **Check Vercel Logs**
   - Go to your project in Vercel dashboard
   - Click on "Functions" tab
   - View function logs for errors

2. **Test Locally**
   ```bash
   # Backend
   cd server
   npm install
   npm start
   
   # Frontend
   cd client
   npm install
   npm start
   ```

3. **Verify Environment Variables**
   - Check all required variables are set
   - Verify no typos in variable names
   - Test database connection

## 📋 Quick Commands

```bash
# Deploy to Vercel
# 1. Connect GitHub repo to Vercel
# 2. Set root directory (server for backend, client for frontend)
# 3. Add environment variables
# 4. Deploy!

# Test deployment
curl https://your-backend-name.vercel.app/health

# Set up database (if using local setup)
cd server
npm run db:setup
```

## 🎯 Next Steps

After successful deployment:

1. **Test Full Flow**
   - User registration/login
   - Product browsing
   - Cart functionality
   - Payment processing

2. **Customize**
   - Add your products
   - Customize styling
   - Add more features

3. **Monitor**
   - Check Vercel metrics
   - Monitor Neon database usage
   - Set up error tracking

**Your e-commerce platform should now be live on Vercel with Neon! 🎉**

## 💡 Benefits of This Setup

- **Vercel**: Fast, reliable hosting with automatic deployments
- **Neon**: Serverless PostgreSQL with automatic scaling
- **Easy Setup**: No complex infrastructure management
- **Cost Effective**: Free tiers available for both services
- **Developer Friendly**: Great developer experience and documentation
