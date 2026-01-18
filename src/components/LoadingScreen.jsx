import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useModelPreloader } from '../hooks/useModelLoader'

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing...')
  
  const { loading: modelLoading, progress: modelProgress, error: modelError, isCached } = useModelPreloader('/models/f1-car.glb')

  const loadingMessages = [
    'Initializing...',
    'Downloading 3D model...',
    'Processing model data...',
    'Almost ready...',
  ]

  useEffect(() => {
    // If cached, skip loading screen quickly
    if (isCached && !modelLoading) {
      setProgress(100)
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 200)
      return
    }

    if (modelLoading) {
      const currentProgress = Math.max(5, modelProgress)
      setProgress(currentProgress)
      
      if (currentProgress < 25) {
        setLoadingText(loadingMessages[0])
      } else if (currentProgress < 60) {
        setLoadingText(loadingMessages[1])
      } else if (currentProgress < 90) {
        setLoadingText(loadingMessages[2])
      } else {
        setLoadingText(loadingMessages[3])
      }
    } else {
      setProgress(100)
      setLoadingText(loadingMessages[3])
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 500)
    }
  }, [modelLoading, modelProgress, isCached, onComplete])

  useEffect(() => {
    if (modelError) {
      console.warn('Model loading error, continuing anyway:', modelError)
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 1000)
    }
  }, [modelError, onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center z-50">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Portfolio
        </h1>

        {/* Loading Text */}
        <div className="mb-10 text-center">
          <p className="text-gray-300 text-lg font-medium">
            {loadingText}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full">
          <div className="relative w-full h-10 bg-gray-800/50 rounded-full border border-gray-700/50 overflow-visible">
            {/* Progress Fill - smooth animation */}
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full overflow-hidden"
              initial={{ width: '5%' }}
              animate={{ width: `${Math.max(5, progress)}%` }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] // smooth cubic bezier
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>

            {/* F1 Car - smooth movement with progress */}
            <motion.div
              className="absolute text-4xl pointer-events-none z-10"
              style={{
                top: '50%',
                left: `${Math.max(5, progress)}%`,
                marginLeft: '-1.5rem',
                transform: 'translateY(-50%) scaleX(-1)', // Flip to face right
                filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))',
              }}
              initial={{ left: 'calc(5% - 1.5rem)' }}
              animate={{ 
                left: `calc(${Math.max(5, progress)}% - 1.5rem)`,
              }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              🏎️
            </motion.div>
          </div>

          {/* Progress Text */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-500 text-sm uppercase font-medium">
              Loading
            </span>
            <span className="text-white text-xl font-bold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Checkered Flag */}
        {progress >= 90 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 text-5xl"
          >
            🏁
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LoadingScreen
