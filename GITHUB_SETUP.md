# GitHub Setup Guide

This guide will help you set up this e-commerce platform project on GitHub.

## 🚀 Quick Setup

### 1. Run the Setup Script
```bash
# Make the script executable (if not already done)
chmod +x scripts/setup-github.sh

# Run the setup script
./scripts/setup-github.sh
```

### 2. Create GitHub Repository

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Click "New repository" or the "+" icon

2. **Repository Settings**
   - **Repository name**: `e-commerce-platform`
   - **Description**: `Full-stack e-commerce platform with React, Node.js, PostgreSQL, and Stripe`
   - **Visibility**: Choose Public or Private
   - **Initialize**: Don't initialize with README, .gitignore, or license (we already have these)

3. **Create Repository**
   - Click "Create repository"

### 3. Connect Local Repository to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/e-commerce-platform.git

# Push to GitHub
git push -u origin main
```

## 🔧 Repository Configuration

### 1. Repository Settings

After creating the repository, configure these settings:

#### **General Settings**
- Go to Settings → General
- Add a repository description
- Add topics: `ecommerce`, `react`, `nodejs`, `postgresql`, `stripe`, `fullstack`
- Enable issues and discussions

#### **Branches**
- Go to Settings → Branches
- Set `main` as the default branch
- Add branch protection rules:
  - Require pull request reviews
  - Require status checks to pass
  - Require branches to be up to date

#### **Security**
- Go to Settings → Security
- Enable Dependabot alerts
- Enable secret scanning
- Enable push protection

### 2. GitHub Actions

The project includes a CI/CD pipeline that will automatically run on:
- Push to main/develop branches
- Pull requests

**Features:**
- Automated testing
- Code linting
- Security audits
- Build verification

### 3. Issue Templates

The repository includes issue templates for:
- Bug reports
- Feature requests
- Questions

These help maintainers and contributors structure their issues properly.

## 📋 Pre-Deployment Checklist

Before pushing to GitHub, ensure you've completed these steps:

### ✅ Code Preparation
- [ ] All code is committed
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Environment variables are in `.env` files (not committed)
- [ ] `.gitignore` is properly configured
- [ ] README.md is updated with your details

### ✅ Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies are up to date
- [ ] Security audit passed

### ✅ Documentation
- [ ] README.md is complete
- [ ] CONTRIBUTING.md is present
- [ ] LICENSE is included
- [ ] CHANGELOG.md is started

## 🔐 Environment Variables Setup

### 1. Create Environment Files

**Server (.env)**
```bash
# Copy the example file
cp server/env.example server/.env

# Edit with your values
nano server/.env
```

**Client (.env)**
```bash
# Create client environment file
touch client/.env

# Add your values
echo "REACT_APP_API_URL=http://localhost:5000/api" >> client/.env
echo "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here" >> client/.env
```

### 2. Required Environment Variables

#### Backend (server/.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 🚀 First Deployment

### 1. Local Testing
```bash
# Install dependencies
npm run install-all

# Set up database
cd server
npm run db:setup

# Start development servers
npm run dev
```

### 2. Test the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Test user registration/login
- Test product browsing
- Test cart functionality
- Test payment flow (use Stripe test mode)

### 3. Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📊 GitHub Features to Enable

### 1. GitHub Pages (Optional)
- Go to Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages`
- Use for documentation or demo

### 2. GitHub Discussions
- Go to Settings → General
- Enable discussions
- Create categories for:
  - General
  - Q&A
  - Ideas
  - Show and tell

### 3. GitHub Projects
- Create a project board
- Add issues and pull requests
- Track development progress

### 4. GitHub Wiki
- Enable wiki for additional documentation
- Create pages for:
  - API documentation
  - Architecture overview
  - Development guidelines

## 🔄 Workflow Setup

### 1. Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### 2. Pull Request Template
The repository includes a PR template that will be used for all pull requests.

### 3. Code Review Process
1. Create feature branch
2. Make changes
3. Create pull request
4. Request review
5. Address feedback
6. Merge after approval

## 🛠️ Development Workflow

### 1. Daily Development
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Contributing
- Fork the repository
- Create feature branch
- Make changes
- Submit pull request
- Follow the contributing guidelines

## 📈 Monitoring and Analytics

### 1. GitHub Insights
- Go to Insights tab
- Monitor:
  - Traffic
  - Contributors
  - Commits
  - Issues and PRs

### 2. Dependabot
- Automatically creates PRs for dependency updates
- Review and merge security updates
- Keep dependencies up to date

### 3. Code Scanning
- Enable GitHub Code Scanning
- Set up security alerts
- Monitor for vulnerabilities

## 🆘 Troubleshooting

### Common Issues

1. **Push Rejected**
   ```bash
   # Pull latest changes first
   git pull origin main
   # Then push
   git push origin main
   ```

2. **Large File Upload**
   ```bash
   # Use Git LFS for large files
   git lfs track "*.zip"
   git add .gitattributes
   ```

3. **Environment Variables Not Working**
   - Check file names (.env not .env.txt)
   - Verify variable names match exactly
   - Restart development server

### Getting Help
- Check existing issues
- Create new issue with details
- Ask in discussions
- Contact maintainers

## 🎉 Success!

Once everything is set up, you should have:

- ✅ Repository on GitHub
- ✅ CI/CD pipeline running
- ✅ Issue templates configured
- ✅ Environment variables set
- ✅ Local development working
- ✅ Ready for collaboration

**Happy coding! 🚀**

---

## Quick Reference

### Essential Commands
```bash
# Initial setup
./scripts/setup-github.sh
git remote add origin https://github.com/YOUR_USERNAME/e-commerce-platform.git
git push -u origin main

# Development
npm run dev
npm run install-all

# Database
cd server && npm run db:setup

# Docker
docker-compose up -d
```

### Important Files
- `.gitignore` - Files to ignore
- `README.md` - Project documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `DEPLOYMENT.md` - Deployment instructions
- `.github/workflows/ci.yml` - CI/CD pipeline
