#!/bin/bash

# Live Demo Deployment Script
# This script helps deploy the e-commerce platform for a live demo

echo "🚀 Setting up Live Demo Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run setup-github.sh first."
    exit 1
fi

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  You're not on the main branch. Current branch: $current_branch"
    read -p "Do you want to continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "feat: prepare for live demo deployment"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🎯 Next Steps for Live Demo:"
echo ""
echo "1. 🌐 Deploy Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Sign up/login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your repository"
echo "   - Set Root Directory to 'client'"
echo "   - Add environment variables:"
echo "     REACT_APP_API_URL=https://your-backend-url.vercel.app/api"
echo "     REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key"
echo "   - Click 'Deploy'"
echo ""
echo "2. 🔧 Deploy Backend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Sign up/login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your repository"
echo "   - Set Root Directory to 'server'"
echo "   - Add environment variables (see VERCEL_NEON_DEPLOYMENT.md)"
echo "   - Click 'Deploy'"
echo ""
echo "3. 🗄️ Set up Database (Neon):"
echo "   - Go to https://neon.tech"
echo "   - Create a new project"
echo "   - Copy the connection string"
echo "   - Use Neon SQL editor to run the SQL from server/scripts/setup-db.js"
echo ""
echo "4. 🔗 Update Frontend URL:"
echo "   - Update REACT_APP_API_URL in Vercel with your Vercel backend URL"
echo "   - Redeploy frontend"
echo ""
echo "📚 For detailed instructions, see VERCEL_NEON_DEPLOYMENT.md"
echo ""
echo "🎉 Your live demo will be ready in minutes!"
echo ""
echo "🔗 Demo URLs will be:"
echo "   Frontend: https://your-app-name.vercel.app"
echo "   Backend: https://your-backend-name.vercel.app"
echo ""
echo "💡 Pro tip: Use Stripe test mode for the demo!"
echo "   Test card: 4242 4242 4242 4242"
