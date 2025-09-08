# Railway Deployment Guide

This guide will help you deploy the backend to Railway and fix the deployment issues.

## 🚀 Quick Fix for Railway Deployment

The error you encountered is because Railway was trying to run a build script that doesn't exist. Here's how to fix it:

### 1. Updated Files

I've updated the following files to fix the Railway deployment:

- **`server/package.json`** - Added a build script
- **`server/nixpacks.toml`** - Added proper Nixpacks configuration
- **`server/index.js`** - Added health check endpoint
- **`server/railway.json`** - Updated health check path

### 2. Deploy to Railway

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure the Service**
   - Set **Root Directory** to `server`
   - Railway will automatically detect it's a Node.js project

4. **Add PostgreSQL Database**
   - Click "+" in your project
   - Select "Database" → "PostgreSQL"
   - This will create a PostgreSQL database

5. **Set Environment Variables**
   Go to your service settings and add these environment variables:

   ```env
   NODE_ENV=production
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   JWT_SECRET=your-super-secret-jwt-key-for-production
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   PORT=5000
   ```

6. **Deploy**
   - Railway will automatically deploy when you save the environment variables
   - The deployment should now succeed!

### 3. Set Up Database

After deployment, you need to set up the database:

1. **Get Database Connection String**
   - Go to your PostgreSQL service in Railway
   - Click on "Connect" tab
   - Copy the connection details

2. **Run Database Setup**
   ```bash
   # Option 1: Use Railway CLI
   railway connect
   railway run npm run db:setup
   
   # Option 2: Connect directly with psql
   psql "your-connection-string"
   # Then run the SQL from server/scripts/setup-db.js
   ```

### 4. Test Your Deployment

1. **Check Health Endpoint**
   ```
   https://your-app-name.railway.app/health
   ```

2. **Test API Endpoints**
   ```
   https://your-app-name.railway.app/api/health
   ```

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Make sure Root Directory is set to `server`
   - Check that all environment variables are set
   - Verify the nixpacks.toml file is present

2. **Database Connection Issues**
   - Verify environment variables are correctly set
   - Check that PostgreSQL service is running
   - Ensure connection string is correct

3. **Health Check Fails**
   - Check that the `/health` endpoint is accessible
   - Verify the server is starting correctly
   - Check Railway logs for errors

### Debug Steps

1. **Check Railway Logs**
   - Go to your service in Railway dashboard
   - Click on "Deployments" tab
   - View the logs for any errors

2. **Test Locally**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Verify Environment Variables**
   - Make sure all required variables are set
   - Check for typos in variable names
   - Ensure Stripe keys are valid

## 📋 Environment Variables Reference

### Required Variables
```env
NODE_ENV=production
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PORT=5000
```

### Optional Variables
```env
CLIENT_URL=https://your-frontend-url.vercel.app
```

## 🎯 Next Steps

After successful deployment:

1. **Update Frontend**
   - Update `REACT_APP_API_URL` in your frontend deployment
   - Point it to your Railway backend URL

2. **Test Full Flow**
   - Test user registration/login
   - Test product browsing
   - Test cart functionality
   - Test payment processing

3. **Monitor**
   - Check Railway metrics
   - Monitor database usage
   - Set up error tracking

## 🚀 Production Considerations

### Security
- Use strong JWT secrets
- Enable HTTPS (automatic on Railway)
- Set up proper CORS policies
- Use production Stripe keys when ready

### Performance
- Monitor database performance
- Set up connection pooling
- Implement caching strategies
- Monitor memory usage

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track database queries
- Set up uptime monitoring

---

## Quick Commands

```bash
# Deploy to Railway
# 1. Go to railway.app
# 2. Create new project from GitHub
# 3. Set root directory to 'server'
# 4. Add PostgreSQL database
# 5. Set environment variables
# 6. Deploy!

# Test deployment
curl https://your-app-name.railway.app/health

# Set up database
railway connect
railway run npm run db:setup
```

**Your backend should now deploy successfully to Railway! 🎉**
