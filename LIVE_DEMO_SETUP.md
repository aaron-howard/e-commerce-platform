# Live Demo Setup Guide

This guide will help you deploy your e-commerce platform to create a live demo that others can access.

## 🚀 Quick Demo Options

### Option 1: Vercel + Railway (Recommended)

This is the fastest way to get a live demo running.

#### Frontend (Vercel)
1. **Deploy Frontend**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Set **Root Directory** to `client`
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
     ```
   - Click "Deploy"

#### Backend (Railway)
1. **Deploy Backend**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set **Root Directory** to `server`
   - Add PostgreSQL database:
     - Click "+" → "Database" → "PostgreSQL"
   - Add environment variables:
     ```
     NODE_ENV=production
     DB_HOST=${{Postgres.PGHOST}}
     DB_PORT=${{Postgres.PGPORT}}
     DB_NAME=${{Postgres.PGDATABASE}}
     DB_USER=${{Postgres.PGUSER}}
     DB_PASSWORD=${{Postgres.PGPASSWORD}}
     JWT_SECRET=your-production-jwt-secret
     STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
     PORT=5000
     ```
   - Click "Deploy"

2. **Set up Database**
   - Go to your Railway project
   - Click on the PostgreSQL service
   - Go to "Connect" tab
   - Copy the connection details
   - Run the database setup:
     ```bash
     # Connect to Railway database and run setup
     cd server
     npm run db:setup
     ```

3. **Update Frontend URL**
   - Go back to Vercel
   - Update the `REACT_APP_API_URL` to your Railway backend URL
   - Redeploy

### Option 2: Netlify + Railway

#### Frontend (Netlify)
1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "New site from Git"
   - Select your repository
   - Set **Base directory** to `client`
   - Set **Build command** to `npm run build`
   - Set **Publish directory** to `client/build`
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
     ```
   - Click "Deploy site"

#### Backend (Railway)
- Follow the same Railway setup as Option 1

### Option 3: Full Vercel Deployment

#### Frontend + Backend (Vercel)
1. **Deploy Frontend**
   - Follow Vercel frontend setup from Option 1

2. **Deploy Backend**
   - Create a new Vercel project
   - Set **Root Directory** to `server`
   - Add environment variables (same as Railway)
   - Deploy

3. **Add Database**
   - Use Vercel Postgres or external database
   - Update environment variables accordingly

## 🔧 Environment Variables for Demo

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51...your_stripe_key
```

### Backend Environment Variables
```env
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-jwt-key-for-production
STRIPE_SECRET_KEY=sk_test_51...your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_51...your_stripe_publishable_key
PORT=5000
```

## 🎯 Demo Features to Test

Once deployed, test these features:

### User Features
- [ ] User registration
- [ ] User login
- [ ] Product browsing
- [ ] Search and filtering
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment with Stripe test cards
- [ ] Order confirmation

### Admin Features
- [ ] Admin login
- [ ] Product management
- [ ] Order management
- [ ] User management

### Test Data
The database setup script includes sample data:
- Sample products
- Sample categories
- Test user accounts

## 🧪 Stripe Test Mode

For the demo, use Stripe test mode:

### Test Card Numbers
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires 3D Secure: 4000 0025 0000 3155
```

### Test Details
- Use any future expiry date
- Use any 3-digit CVC
- Use any billing address

## 📱 Demo URLs

After deployment, you'll have:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-backend-name.railway.app`
- **API Health**: `https://your-backend-name.railway.app/api/health`

## 🔄 Updating the Demo

### Automatic Updates
- Both Vercel and Railway auto-deploy on Git push
- Update code → Push to GitHub → Auto-deploy

### Manual Updates
- Vercel: Go to dashboard → Redeploy
- Railway: Go to dashboard → Redeploy

## 🛠️ Troubleshooting Demo Issues

### Common Issues

1. **CORS Errors**
   - Update CORS settings in backend
   - Ensure frontend URL is in allowed origins

2. **Database Connection**
   - Check database credentials
   - Verify database is running
   - Run database setup script

3. **Environment Variables**
   - Double-check all environment variables
   - Ensure no typos in variable names
   - Restart services after changes

4. **Stripe Issues**
   - Verify API keys are correct
   - Ensure using test mode keys
   - Check webhook configuration

### Debug Steps
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

## 🎉 Demo Success Checklist

- [ ] Frontend loads without errors
- [ ] Backend API responds to health check
- [ ] User can register and login
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Payment processing works
- [ ] Admin features accessible
- [ ] Mobile responsive design works

## 📊 Demo Analytics

### Vercel Analytics
- Enable Vercel Analytics for frontend metrics
- Monitor page views and performance

### Railway Metrics
- Monitor backend performance
- Check database usage
- Monitor API response times

## 🔐 Security for Demo

### Demo-Specific Security
- Use test Stripe keys only
- Use strong JWT secrets
- Enable HTTPS (automatic on Vercel/Railway)
- Set up proper CORS policies

### Production Considerations
- Use production Stripe keys
- Implement rate limiting
- Add monitoring and logging
- Set up proper backup strategies

## 🚀 Going Live

When ready for production:

1. **Update Stripe Keys**
   - Switch to live Stripe keys
   - Update webhook endpoints
   - Test with real payment methods

2. **Database Migration**
   - Set up production database
   - Migrate data if needed
   - Set up backups

3. **Domain Setup**
   - Configure custom domain
   - Set up SSL certificates
   - Update DNS settings

4. **Monitoring**
   - Set up error tracking
   - Monitor performance
   - Set up alerts

---

## Quick Start Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "feat: add live demo configuration"
git push origin main

# 2. Deploy to Vercel (Frontend)
# - Go to vercel.com
# - Import repository
# - Set root directory to 'client'
# - Add environment variables
# - Deploy

# 3. Deploy to Railway (Backend)
# - Go to railway.app
# - Import repository
# - Set root directory to 'server'
# - Add PostgreSQL database
# - Add environment variables
# - Deploy

# 4. Set up database
cd server
npm run db:setup

# 5. Test your demo!
```

**Your live demo will be ready in minutes! 🎉**
