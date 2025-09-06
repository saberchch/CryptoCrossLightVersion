# Deploy to Render.com

## Prerequisites
- GitHub account
- Render.com account
- Your code pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/crypto-learning-platform.git
git push -u origin main
```

### 2. Deploy on Render.com

1. **Go to Render.com** and sign in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `crypto-learning-platform`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or upgrade for better performance)

### 3. Environment Variables (Optional)
Add these in Render dashboard → Environment:
- `NODE_ENV=production`
- `RENDER_EXTERNAL_URL=https://your-app-name.onrender.com`

### 4. Deploy
Click **"Create Web Service"** and wait for deployment.

## File Structure for Render
```
crypto-learning-platform/
├── app/                    # Next.js App Router
├── components/            # React components
├── data/quizzes/          # Individual quiz JSON files
├── lib/                   # Utility functions
├── public/                # Static assets
├── package.json           # Dependencies
├── next.config.js         # Next.js config (auto-generated)
├── render.yaml            # Render configuration
├── Dockerfile             # Docker configuration
└── .dockerignore          # Docker ignore file
```

## Important Notes

### Quiz Files
- Quiz files are stored in `data/quizzes/` directory
- Each quiz is a separate JSON file: `quiz-id.json`
- Files persist between deployments on Render

### Admin Access
- Admin panel: `https://your-app.onrender.com/admin`
- Upload quiz files through the web interface
- Download template: `https://your-app.onrender.com/quiz-template.json`

### Free Plan Limitations
- **Sleeps after 15 minutes** of inactivity
- **Cold start** takes ~30 seconds
- **512MB RAM** limit
- **100GB bandwidth** per month

### Upgrading (Recommended for Production)
- **Starter Plan ($7/month)**: Always-on, faster cold starts
- **Standard Plan ($25/month)**: Better performance, more resources

## Custom Domain (Optional)
1. Go to Render dashboard → Your service → Settings
2. Add custom domain
3. Update DNS records as instructed

## Monitoring
- View logs in Render dashboard
- Monitor performance and errors
- Set up alerts for downtime

## Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version compatibility
2. **App crashes**: Check logs for missing dependencies
3. **Slow loading**: Consider upgrading plan or optimizing images
4. **Quiz upload fails**: Check file permissions and disk space

### Debug Commands
```bash
# Check if app builds locally
npm run build

# Test production build
npm start

# Check for TypeScript errors
npm run lint
```

## Security Considerations
- Quiz files are publicly accessible via API
- Consider adding authentication for admin panel
- Implement rate limiting for API endpoints
- Use HTTPS (automatic on Render)

## Performance Optimization
- Enable Next.js image optimization
- Use CDN for static assets
- Implement caching strategies
- Optimize bundle size

---

**Your app will be available at**: `https://your-app-name.onrender.com`

**Admin panel**: `https://your-app-name.onrender.com/admin`
