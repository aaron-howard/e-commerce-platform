#!/bin/bash

# GitHub Repository Setup Script
# This script helps set up the project for GitHub

echo "🚀 Setting up E-Commerce Platform for GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files to git
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: initial e-commerce platform setup

- Complete React frontend with Tailwind CSS
- Node.js/Express backend with PostgreSQL
- Stripe payment integration
- Admin dashboard and user management
- Docker configuration
- CI/CD pipeline setup
- Comprehensive documentation"

# Create main branch if it doesn't exist
echo "🌿 Setting up main branch..."
git branch -M main

echo "✅ Git repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/e-commerce-platform.git"
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "🔧 Don't forget to:"
echo "- Update environment variables in .env files"
echo "- Set up your Stripe account and API keys"
echo "- Configure your PostgreSQL database"
echo "- Update the README.md with your specific details"
echo ""
echo "🎉 Happy coding!"
