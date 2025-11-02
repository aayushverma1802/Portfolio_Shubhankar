# Quick Start Guide

## 🚀 Getting Started

Your production-ready 3D Mechanical Engineer Portfolio is ready to use!

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The site will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📝 Customization Checklist

### 1. Update Personal Information

- **Hero Section** (`src/components/Hero.jsx`): Update name, tagline, and social links
- **About Section** (`src/components/About.jsx`): Edit bio, stats, and achievements
- **Contact Section** (`src/components/Contact.jsx`): Update email, phone, location, and social media links

### 2. Add Your Projects

Edit `src/components/Projects.jsx`:
- Replace project images (use your own or update Unsplash URLs)
- Update project descriptions, technologies, and features
- Add your project links and GitHub repositories

### 3. Customize Skills

Edit `src/components/Skills.jsx`:
- Modify skill categories to match your expertise
- Update proficiency levels (0-100%)
- Add or remove skill items

### 4. Styling & Colors

Edit `tailwind.config.js` to customize:
- Primary colors (blue gradient)
- Secondary colors (purple gradient)
- Accent colors (pink gradient)

### 5. 3D Scene Customization

Edit `src/components/Scene3D.jsx` to:
- Change 3D object colors
- Adjust animation speeds
- Add or remove 3D elements
- Modify lighting and materials

## 🎨 Features Included

✅ Fully responsive design
✅ Smooth animations with Framer Motion
✅ Interactive 3D background scene
✅ Project showcase with modal details
✅ Skills visualization with progress bars
✅ Contact form (configure backend)
✅ SEO optimized
✅ Accessibility features
✅ Error boundaries
✅ Loading screen
✅ Mobile navigation menu

## 📦 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
3. Run: `npm run deploy`

## 🔧 Technical Notes

- **3D Performance**: The 3D scene is optimized for performance with controlled polygon counts
- **Images**: Current images use Unsplash. Replace with your own optimized images for production
- **Form Submission**: The contact form currently shows an alert. Connect to your backend/email service
- **Analytics**: Add Google Analytics or similar by editing `index.html`

## 🐛 Troubleshooting

**3D scene not loading?**
- Check browser console for errors
- Ensure WebGL is enabled in your browser
- Try a different browser (Chrome recommended)

**Build errors?**
- Run `npm install` again
- Clear `node_modules` and reinstall
- Check Node.js version (16+ required)

**Styling issues?**
- Clear browser cache
- Ensure Tailwind CSS is properly configured
- Check that PostCSS is installed

## 📚 Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Docs](https://threejs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

Enjoy your new 3D portfolio! 🎉
