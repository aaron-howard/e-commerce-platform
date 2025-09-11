# Deployment Guide

This guide covers different deployment options for the e-commerce platform.

## 🚀 Quick Start (Recommended)

### Vercel + Neon Deployment

The easiest way to deploy this application is using Vercel for hosting and Neon for the database.

📖 **See [VERCEL_NEON_DEPLOYMENT.md](./VERCEL_NEON_DEPLOYMENT.md) for detailed step-by-step instructions.**

#### Quick Summary
1. **Database**: Set up PostgreSQL with [Neon](https://neon.tech)
2. **Backend**: Deploy to [Vercel](https://vercel.com) with root directory `server`
3. **Frontend**: Deploy to [Vercel](https://vercel.com) with root directory `client`
4. **Environment Variables**: Configure as per the deployment guide

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Local Development
1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-platform
   ```

2. **Install Dependencies**
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

3. **Environment Setup**
   ```bash
   # Backend environment
   cd server
   cp env.example .env
   # Edit .env with your database credentials
   
   # Frontend environment
   cd ../client
   touch .env
   # Add REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   ```bash
   cd server
   npm run db:setup
   ```

5. **Run Development Servers**
   ```bash
   # Backend (Terminal 1)
   cd server
   npm run dev
   
   # Frontend (Terminal 2)
   cd client
   npm start
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🌐 Production Deployment Options

### Option 1: Vercel + Neon (Recommended)

#### Why This Combination?
- **Vercel**: Excellent developer experience, automatic deployments, global CDN
- **Neon**: Serverless PostgreSQL, automatic scaling, easy setup
- **Cost Effective**: Both offer generous free tiers
- **Easy Setup**: Minimal configuration required

#### Frontend (Vercel)
1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set Root Directory to `client`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

#### Backend (Vercel)
1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set Root Directory to `server`

2. **Add Database (Neon)**
   - Go to [Neon](https://neon.tech)
   - Create a new project
   - Copy the connection string

3. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   JWT_SECRET=your-production-jwt-secret
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push

### Option 2: AWS Deployment

#### Frontend (AWS S3 + CloudFront)
1. **Build and Upload**
   ```bash
   cd client
   npm run build
   aws s3 sync build/ s3://your-bucket-name
   ```

2. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure custom domain (optional)

#### Backend (AWS Lambda + API Gateway)
1. **Package Application**
   ```bash
   cd server
   npm install --production
   zip -r function.zip .
   ```

2. **Deploy Lambda Function**
   - Create Lambda function
   - Upload zip file
   - Configure environment variables

3. **Set up API Gateway**
   - Create REST API
   - Configure routes
   - Deploy API

#### Database (AWS RDS)
1. **Create RDS Instance**
   - Choose PostgreSQL engine
   - Configure security groups
   - Set up database

2. **Environment Variables**
   ```
   DB_HOST=your-rds-endpoint
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-username
   DB_PASSWORD=your-password
   ```

### Option 3: Docker Deployment

#### Using Docker Compose
1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:13
       environment:
         POSTGRES_DB: ecommerce
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       ports:
         - "5432:5432"
     
     backend:
       build: ./server
       ports:
         - "5000:5000"
       environment:
         - DB_HOST=postgres
         - DB_PORT=5432
         - DB_NAME=ecommerce
         - DB_USER=postgres
         - DB_PASSWORD=password
       depends_on:
         - postgres
     
     frontend:
       build: ./client
       ports:
         - "3000:3000"
       environment:
         - REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

#### Using Kubernetes
1. **Create Kubernetes manifests**
2. **Deploy to cluster**
3. **Configure ingress**

### Option 4: Heroku Deployment

#### Frontend (Heroku)
1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Configure Buildpack**
   ```bash
   heroku buildpacks:set https://github.com/mars/create-react-app-buildpack.git
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

#### Backend (Heroku)
1. **Create Heroku App**
   ```bash
   heroku create your-api-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # ... other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 Environment Variables Reference

### Backend Variables
```env
# Database
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
# OR individual variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Server
PORT=5000
NODE_ENV=production

# CORS
CLIENT_URL=https://your-frontend-url.com
```

### Frontend Variables
```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🗄️ Database Setup

### Using Neon (Recommended)
1. **Create Project**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Set up Schema**
   - Use Neon SQL editor
   - Run SQL from `server/scripts/setup-db.js`

### Using Other Databases
- **Supabase**: Similar to Neon, with additional features
- **AWS RDS**: More complex but highly scalable
- **Heroku Postgres**: Simple but more expensive
- **DigitalOcean Managed Database**: Good middle ground

## 🔍 Testing Deployment

### Health Checks
- **Backend Health**: `https://your-backend-url.com/health`
- **API Health**: `https://your-backend-url.com/api/health`

### Feature Testing
1. **User Registration/Login**
2. **Product Browsing**
3. **Add to Cart**
4. **Checkout Process**
5. **Payment Processing**

### Load Testing
- Use tools like Artillery or k6
- Test with realistic user loads
- Monitor performance metrics

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**
   - Check `CLIENT_URL` in backend environment variables
   - Ensure frontend URL matches exactly

2. **Database Connection Issues**
   - Verify connection string is correct
   - Check database is accessible
   - Ensure SSL is configured properly

3. **Environment Variable Issues**
   - Check all required variables are set
   - Verify no typos in variable names
   - Redeploy after making changes

4. **Build Failures**
   - Check build logs for errors
   - Verify all dependencies are in package.json
   - Check for syntax errors

### Debug Steps
1. **Check Logs**
   - Vercel: Function logs in dashboard
   - AWS: CloudWatch logs
   - Heroku: `heroku logs --tail`

2. **Test Locally**
   - Run application locally first
   - Test with production environment variables

3. **Verify Configuration**
   - Check all environment variables
   - Test database connection
   - Verify API endpoints

## 📊 Monitoring and Maintenance

### Performance Monitoring
- **Vercel**: Built-in analytics and performance monitoring
- **AWS**: CloudWatch metrics and alarms
- **Heroku**: Built-in metrics and add-ons

### Error Tracking
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking
- **Bugsnag**: Error monitoring and reporting

### Database Monitoring
- **Neon**: Built-in query performance monitoring
- **AWS RDS**: CloudWatch metrics and Performance Insights
- **Heroku Postgres**: Built-in metrics and query analysis

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Vercel Git Integration
- Automatic deployments on push
- Preview deployments for pull requests
- Rollback capabilities

## 💰 Cost Considerations

### Vercel + Neon
- **Vercel**: Free tier available, pay per usage
- **Neon**: Free tier available, pay per compute time
- **Total**: Very cost-effective for small to medium projects

### AWS
- **S3 + CloudFront**: Pay per storage and requests
- **Lambda**: Pay per request and execution time
- **RDS**: Pay per instance size and storage
- **Total**: More expensive but highly scalable

### Heroku
- **Dynos**: Fixed monthly cost
- **Postgres**: Fixed monthly cost
- **Total**: Predictable but more expensive

## 🎯 Best Practices

### Security
- Use environment variables for sensitive data
- Enable HTTPS everywhere
- Set up proper CORS policies
- Use strong JWT secrets
- Regular security updates

### Performance
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Monitor performance metrics
- Use connection pooling

### Scalability
- Design for horizontal scaling
- Use stateless application design
- Implement proper caching
- Monitor resource usage
- Plan for traffic spikes

## 🆘 Getting Help

### Documentation
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Neon**: [neon.tech/docs](https://neon.tech/docs)
- **AWS**: [docs.aws.amazon.com](https://docs.aws.amazon.com)
- **Heroku**: [devcenter.heroku.com](https://devcenter.heroku.com)

### Community
- **GitHub Issues**: Report bugs and request features
- **Discord/Slack**: Community support channels
- **Stack Overflow**: Technical questions
- **Reddit**: General discussions

---

**Choose the deployment option that best fits your needs and budget! 🚀**

For the easiest setup, we recommend **Vercel + Neon** as it provides the best developer experience with minimal configuration.