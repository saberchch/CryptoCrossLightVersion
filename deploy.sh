#!/bin/bash

# Crypto Learning Platform - Deployment Script for Render.com

echo "🚀 Crypto Learning Platform - Render.com Deployment"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to Render.com - $(date)"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/crypto-learning-platform.git"
    echo "   git push -u origin main"
    echo ""
    echo "Then follow the DEPLOYMENT.md guide to deploy on Render.com"
    exit 1
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🌐 Your app will be available at: https://your-app-name.onrender.com"
echo "👨‍💼 Admin panel: https://your-app-name.onrender.com/admin"
