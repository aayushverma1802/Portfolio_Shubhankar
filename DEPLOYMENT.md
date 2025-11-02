# 🚀 Deployment Guide

Your 3D portfolio is ready to deploy! Here are the easiest methods:

## Option 1: Vercel (Recommended - Easiest) ⭐

### Method A: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Press Enter to confirm
   - Press Enter to link to existing project or create new
   - Press Enter to deploy to production
   - Your site will be live at `https://your-project.vercel.app`

### Method B: Using Vercel Dashboard (No CLI)

1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "Add New Project"
3. Import your GitHub repository (or drag & drop the folder)
4. Vercel will auto-detect Vite settings
5. Click "Deploy"
6. Your site will be live in ~2 minutes!

## Option 2: Netlify

### Using Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop your `dist` folder
3. Or connect your GitHub repository
4. Your site will be live instantly!

## Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Configure in GitHub:**
   - Go to repository Settings > Pages
   - Select branch: `gh-pages`
   - Your site will be at: `https://username.github.io/repo-name`

## Option 4: Other Platforms

### Render
1. Go to [render.com](https://render.com)
2. New Static Site
3. Connect repository
4. Build command: `npm run build`
5. Publish directory: `dist`

### Surge.sh
```bash
npm install -g surge
surge dist/
```

## 🎯 Quick Deploy (Recommended)

**For fastest deployment, use Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

That's it! Your site will be live in seconds.

## 📝 Pre-Deployment Checklist

- ✅ Build completed successfully (`npm run build`)
- ✅ Test locally (`npm run preview`)
- ✅ Update personal information in components
- ✅ Update social media links
- ✅ Replace placeholder images (if any)
- ✅ Update contact email/phone
- ✅ Check all links work

## 🔧 Environment Variables

If you need environment variables:

**Vercel:**
- Settings > Environment Variables

**Netlify:**
- Site settings > Environment variables

## 📊 Performance Tips

The build includes:
- Optimized 3D assets
- Minified JavaScript
- Compressed CSS
- Production-ready configuration

## 🌐 Custom Domain

All platforms support custom domains:
- **Vercel**: Settings > Domains
- **Netlify**: Site settings > Domain management
- Add your domain and update DNS records

## 🎉 After Deployment

Your portfolio will be live with:
- ✅ All 3D animations working
- ✅ Scroll-based interactions
- ✅ Responsive design
- ✅ Fast loading times
- ✅ SEO optimized

**Share your amazing 3D portfolio with the world!** 🚀

