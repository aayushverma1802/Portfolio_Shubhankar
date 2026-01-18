import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, PerformanceMonitor, useGLTF } from '@react-three/drei'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import EnhancedScene3D from './components/EnhancedScene3D'
import ScrollCamera from './components/ScrollCamera'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [loading, setLoading] = useState(true)
  
  // Preload model when app starts
  useEffect(() => {
    useGLTF.preload('/models/f1-car.glb').catch(err => {
      console.warn('Preload in App:', err)
    })
  }, [])
  // Initialize DPR based on device pixel ratio, capped at 2 for performance
  const [dpr, setDpr] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.devicePixelRatio || 1, 2)
    }
    return 1.5
  })

  const handleLoadingComplete = () => {
    setLoading(false)
  }

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div className="relative">
      <Navigation />
      
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas
          gl={{ 
            antialias: true,
            alpha: true, 
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false,
            precision: "highp",
            preserveDrawingBuffer: false
          }}
          dpr={dpr}
          performance={{ min: 0.5, max: 1 }}
          camera={{ position: [0, 0, 5], fov: 75 }}
          frameloop="always"
          shadows={false}
          flat={false}
        >
          <PerformanceMonitor
            onIncline={() => setDpr(Math.min(dpr + 0.5, 2))}
            onDecline={() => setDpr(Math.max(dpr - 0.5, 1))}
            flipflops={3}
            threshold={0.5}
          />
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              autoRotate={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.5}
              dampingFactor={0.05}
              enableDamping={true}
            />
            <ScrollCamera />
            <EnhancedScene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Sections */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </div>
    </div>
  )
}

export default App
