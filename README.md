https://portfolio-shubhankar-drab.vercel.app/

# 3D Mechanical Engineer Portfolio

A stunning, production-ready 3D portfolio website for mechanical engineers built with React, Three.js, and React Three Fiber.

## Features

- 🎨 **3D Interactive Scene** - Immersive 3D background with rotating mechanical elements
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- ⚡ **High Performance** - Optimized rendering and smooth animations
- 🎯 **Modern UI/UX** - Beautiful gradient designs and smooth transitions
- 📋 **Complete Sections** - Hero, About, Skills, Projects, and Contact
- 🚀 **Production Ready** - Built with best practices and optimizations

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── About.jsx          # About section
│   │   ├── Contact.jsx         # Contact form and info
│   │   ├── Hero.jsx            # Hero/landing section
│   │   ├── LoadingScreen.jsx   # Loading screen component
│   │   ├── Navigation.jsx      # Navigation bar
│   │   ├── Projects.jsx        # Projects showcase
│   │   ├── Scene3D.jsx         # 3D scene components
│   │   └── Skills.jsx           # Skills section
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Update Personal Information

1. **Hero Section** (`src/components/Hero.jsx`):
   - Update name and tagline
   - Modify social media links

2. **About Section** (`src/components/About.jsx`):
   - Edit your bio and achievements
   - Update statistics

3. **Skills Section** (`src/components/Skills.jsx`):
   - Add/modify skill categories
   - Update proficiency levels

4. **Projects Section** (`src/components/Projects.jsx`):
   - Add your projects with images and details
   - Update project links

5. **Contact Section** (`src/components/Contact.jsx`):
   - Update contact information
   - Modify social media links

### 3D Scene Customization

Edit `src/components/Scene3D.jsx` to:
- Change colors and materials
- Add/remove 3D objects
- Modify animations and rotations

### Styling

- Colors: Edit `tailwind.config.js` for theme colors
- Global styles: Modify `src/index.css`

## Performance Optimization

- 3D scene uses performance optimizations
- Images are lazy-loaded
- Components use React.memo where appropriate
- Smooth scroll behavior

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this portfolio template for your own projects!

## Credits

Built with modern web technologies and best practices for production-ready 3D web experiences.
