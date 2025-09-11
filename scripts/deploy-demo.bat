@echo off
REM Live Demo Deployment Script for Windows
REM This script helps deploy the e-commerce platform for a live demo

echo 🚀 Setting up Live Demo Deployment...

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please run setup-github.sh first.
    pause
    exit /b 1
)

REM Check for uncommitted changes
git status --porcelain > temp_status.txt
if %errorlevel% neq 0 (
    echo ❌ Git status check failed
    pause
    exit /b 1
)

for /f %%i in (temp_status.txt) do (
    echo 📝 You have uncommitted changes. Committing them now...
    git add .
    git commit -m "feat: prepare for live demo deployment"
    goto :push
)

:push
REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Code pushed to GitHub successfully!
echo.
echo 🎯 Next Steps for Live Demo:
echo.
echo 1. 🌐 Deploy Frontend (Vercel):
echo    - Go to https://vercel.com
echo    - Sign up/login with GitHub
echo    - Click 'New Project'
echo    - Import your repository
echo    - Set Root Directory to 'client'
echo    - Add environment variables:
echo      REACT_APP_API_URL=https://your-backend-url.vercel.app/api
echo      REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
echo    - Click 'Deploy'
echo.
echo 2. 🔧 Deploy Backend (Vercel):
echo    - Go to https://vercel.com
echo    - Sign up/login with GitHub
echo    - Click 'New Project'
echo    - Import your repository
echo    - Set Root Directory to 'server'
echo    - Add environment variables (see VERCEL_NEON_DEPLOYMENT.md)
echo    - Click 'Deploy'
echo.
echo 3. 🗄️ Set up Database (Neon):
echo    - Go to https://neon.tech
echo    - Create a new project
echo    - Copy the connection string
echo    - Use Neon SQL editor to run the SQL from server/scripts/setup-db.js
echo.
echo 4. 🔗 Update Frontend URL:
echo    - Update REACT_APP_API_URL in Vercel with your Vercel backend URL
echo    - Redeploy frontend
echo.
echo 📚 For detailed instructions, see VERCEL_NEON_DEPLOYMENT.md
echo.
echo 🎉 Your live demo will be ready in minutes!
echo.
echo 🔗 Demo URLs will be:
echo    Frontend: https://your-app-name.vercel.app
echo    Backend: https://your-backend-name.vercel.app
echo.
echo 💡 Pro tip: Use Stripe test mode for the demo!
echo    Test card: 4242 4242 4242 4242

REM Clean up
del temp_status.txt 2>nul

pause
