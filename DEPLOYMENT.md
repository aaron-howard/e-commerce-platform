# Deployment Guide

This guide covers various deployment options for the E-Commerce Platform.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Stripe account and API keys

### 1. Clone and Setup
```bash
git clone <repository-url>
cd e-commerce-platform
```

### 2. Environment Configuration
```bash
# Copy environment files
cp server/env.example server/.env
cp client/.env.example client/.env

# Update with your configuration
# Edit server/.env and client/.env files
```

### 3. Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🌐 Production Deployment

### Option 1: Vercel + Railway

#### Frontend (Vercel)
1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the `client` folder as root directory

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

#### Backend (Railway)
1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the `server` folder

2. **Add PostgreSQL**
   - Add PostgreSQL service in Railway dashboard
   - Copy connection string

3. **Environment Variables**
   ```
   NODE_ENV=production
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-production-jwt-secret
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   PORT=5000
   ```

4. **Deploy**
   - Railway will automatically deploy on every push

### Option 2: AWS Deployment

#### Frontend (AWS S3 + CloudFront)
1. **Build and Upload**
   ```bash
   cd client
   npm run build
   aws s3 sync build/ s3://your-bucket-name
   ```

2. **CloudFront Distribution**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain

#### Backend (AWS EC2 + RDS)
1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (port 5000)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql-client
   ```

3. **Deploy Application**
   ```bash
   git clone <repository-url>
   cd e-commerce-platform/server
   npm install --production
   npm start
   ```

4. **Set up RDS PostgreSQL**
   - Create RDS PostgreSQL instance
   - Configure security groups
   - Update connection string

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub

2. **Configure Services**
   - **Frontend Service**
     - Source: `client` folder
     - Build command: `npm run build`
     - Run command: `npm start`
   
   - **Backend Service**
     - Source: `server` folder
     - Build command: `npm install`
     - Run command: `npm start`

3. **Add Database**
   - Add PostgreSQL database
   - Configure environment variables

## 🐳 Docker Deployment

### Single Container (Development)
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

### Multi-Container (Production)
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

## 🗄️ Database Setup

### Production Database
1. **Create Database**
   ```sql
   CREATE DATABASE ecommerce;
   CREATE USER ecommerce_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;
   ```

2. **Run Migrations**
   ```bash
   cd server
   npm run db:setup
   ```

### Database Backups
```bash
# Backup
pg_dump -h localhost -U postgres ecommerce > backup.sql

# Restore
psql -h localhost -U postgres ecommerce < backup.sql
```

## 🔒 Security Considerations

### SSL/TLS
- Use HTTPS in production
- Configure SSL certificates
- Update CORS settings for production domain

### Environment Variables
- Never commit `.env` files
- Use secure secret management
- Rotate secrets regularly

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access
- Regular backups

### API Security
- Rate limiting
- Input validation
- SQL injection prevention
- CORS configuration

## 📊 Monitoring and Logging

### Application Monitoring
- Set up error tracking (Sentry)
- Monitor performance metrics
- Set up uptime monitoring

### Logging
```bash
# PM2 for process management
npm install -g pm2
pm2 start server/index.js --name "ecommerce-api"
pm2 startup
pm2 save
```

### Health Checks
```bash
# Backend health check
curl http://localhost:5000/api/health

# Database connection check
curl http://localhost:5000/api/health/db
```

## 🚀 CI/CD Pipeline

### GitHub Actions
The project includes GitHub Actions workflow for:
- Automated testing
- Code quality checks
- Security audits
- Deployment automation

### Manual Deployment
```bash
# Build and deploy
npm run build
npm run deploy
```

## 🔄 Updates and Maintenance

### Application Updates
1. Pull latest changes
2. Install dependencies
3. Run database migrations
4. Restart services

### Database Migrations
```bash
cd server
npm run db:migrate
```

### Zero-Downtime Deployment
1. Deploy to staging
2. Run tests
3. Blue-green deployment
4. Monitor health

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection**
   - Check connection string
   - Verify database is running
   - Check firewall settings

2. **CORS Errors**
   - Update CORS configuration
   - Check domain settings

3. **Stripe Errors**
   - Verify API keys
   - Check webhook configuration

### Logs
```bash
# Docker logs
docker-compose logs -f

# Application logs
pm2 logs ecommerce-api
```

## 📞 Support

For deployment issues:
1. Check the logs
2. Review environment variables
3. Verify service dependencies
4. Contact support team

---

**Happy Deploying! 🚀**
