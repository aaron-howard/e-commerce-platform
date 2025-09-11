# Live Demo Setup Guide

This guide will help you deploy your e-commerce platform to create a live demo that others can access.

## 🚀 Quick Demo Options

### Option 1: Vercel + Neon (Recommended)

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
     REACT_APP_API_URL=https://your-backend-url.vercel.app/api
     REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
     ```
   - Click "Deploy"

#### Backend (Vercel)
1. **Deploy Backend**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Set **Root Directory** to `server`
   - Add environment variables:
     ```
     NODE_ENV=production
     DATABASE_URL=your-neon-connection-string
     JWT_SECRET=your-production-jwt-secret
     STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
     CLIENT_URL=https://your-frontend-url.vercel.app
     ```
   - Click "Deploy"

2. **Set up Database (Neon)**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string
   - Use Neon SQL editor to run the SQL from `server/scripts/setup-db.js`

3. **Update Frontend URL**
   - Go back to Vercel frontend project
   - Update the `REACT_APP_API_URL` to your Vercel backend URL
   - Redeploy

### Option 2: Netlify + Vercel

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
     REACT_APP_API_URL=https://your-backend-url.vercel.app/api
     REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
     ```
   - Click "Deploy site"

#### Backend (Vercel)
- Follow the same Vercel setup as Option 1

## 🎯 Demo URLs

After deployment, your demo will be available at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-backend-name.vercel.app`
- **API Health**: `https://your-backend-name.vercel.app/api/health`

## 🔧 Environment Variables Reference

### Frontend (Vercel/Netlify)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Backend (Vercel)
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-for-production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
CLIENT_URL=https://your-frontend-url.vercel.app
```

## 🗄️ Database Setup

### Using Neon (Recommended)
1. **Create Neon Project**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project
   - Copy the connection string

2. **Set up Schema**
   - Use Neon's SQL editor
   - Run the SQL from `server/scripts/setup-db.js`
   - Or connect with a PostgreSQL client

### Using Other Databases
- **Supabase**: Similar to Neon, serverless PostgreSQL
- **AWS RDS**: More complex but scalable
- **Heroku Postgres**: Simple but more expensive

## 🚀 Deployment Steps Summary

### Quick Deploy (5 minutes)
1. **Database**: Create Neon project → Copy connection string
2. **Backend**: Deploy to Vercel → Add environment variables
3. **Frontend**: Deploy to Vercel → Add environment variables
4. **Connect**: Update frontend URL in backend environment variables
5. **Test**: Visit your demo URLs

### Detailed Steps
1. **Push to GitHub** (if not already done)
2. **Deploy Backend**:
   - Vercel → New Project → Import repo
   - Root Directory: `server`
   - Environment Variables: See reference above
3. **Deploy Frontend**:
   - Vercel → New Project → Import repo
   - Root Directory: `client`
   - Environment Variables: See reference above
4. **Set up Database**:
   - Neon → New Project → Copy connection string
   - Run SQL schema in Neon SQL editor
5. **Connect Services**:
   - Update `CLIENT_URL` in backend environment variables
   - Update `REACT_APP_API_URL` in frontend environment variables
6. **Test Everything**:
   - Check health endpoints
   - Test user registration
   - Test product browsing
   - Test cart functionality
   - Test payment (use test cards)

## 🔍 Testing Your Demo

### Health Checks
- **Backend Health**: `https://your-backend-name.vercel.app/health`
- **API Health**: `https://your-backend-name.vercel.app/api/health`

### Feature Testing
1. **User Registration/Login**
2. **Product Browsing**
3. **Add to Cart**
4. **Checkout Process**
5. **Payment (Test Mode)**

### Test Cards (Stripe Test Mode)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## 🛠️ Troubleshooting

### Common Issues
1. **CORS Errors**
   - Check `CLIENT_URL` in backend environment variables
   - Ensure frontend URL matches exactly

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check Neon project is active
   - Ensure SSL is enabled

3. **Environment Variable Issues**
   - Check all required variables are set
   - Verify no typos in variable names
   - Redeploy after making changes

4. **Build Failures**
   - Check Vercel build logs
   - Verify all dependencies are in package.json
   - Check for syntax errors

### Debug Steps
1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - View function logs for errors

2. **Test Locally First**
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
   - Test database connection
   - Verify Stripe keys are correct

## 📊 Monitoring Your Demo

### Vercel Analytics
- **Performance**: Page load times, Core Web Vitals
- **Usage**: Page views, unique visitors
- **Functions**: API response times, error rates

### Neon Monitoring
- **Database Usage**: Query performance, connection count
- **Storage**: Database size, backup status
- **Performance**: Query execution times

## 🎉 Demo Tips

### For Presentations
1. **Prepare Test Data**: Add some sample products
2. **Use Test Mode**: All payments in test mode
3. **Have Backup Plans**: Multiple demo URLs ready
4. **Test Everything**: Run through full user flow beforehand

### For Development
1. **Use Branches**: Keep demo separate from development
2. **Monitor Costs**: Keep an eye on usage limits
3. **Regular Updates**: Keep dependencies updated
4. **Backup Data**: Export important data regularly

## 🔄 Updates and Maintenance

### Automatic Deployments
- Both Vercel and Neon auto-deploy on Git push
- No manual intervention needed for code updates

### Manual Updates
- **Vercel**: Go to dashboard → Redeploy
- **Neon**: Changes are instant for database

### Scaling Considerations
- **Vercel**: Automatic scaling, pay per usage
- **Neon**: Serverless scaling, pay per compute time
- **Stripe**: Pay per transaction

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode sensitive data
2. **Test Locally First**: Always test before deploying
3. **Monitor Performance**: Keep an eye on response times
4. **Have Backup Plans**: Multiple deployment options ready
5. **Document Everything**: Keep track of URLs and credentials

## 🆘 Getting Help

### Documentation
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Neon**: [neon.tech/docs](https://neon.tech/docs)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)

### Support
- **Vercel**: Community Discord, GitHub Discussions
- **Neon**: Community Discord, GitHub Issues
- **Stripe**: Support tickets, documentation

---

**Your live demo should be ready in minutes! 🎉**

For the most up-to-date deployment guide, see [VERCEL_NEON_DEPLOYMENT.md](./VERCEL_NEON_DEPLOYMENT.md).