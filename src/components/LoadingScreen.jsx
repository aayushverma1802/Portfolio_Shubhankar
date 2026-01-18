import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Sparkles } from 'lucide-react'

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing...')

  const loadingMessages = [
    'Initializing...',
    'Loading assets...',
    'Preparing experience...',
    'Almost ready...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 500)
          return 100
        }
        // Simulate realistic loading progress
        const increment = Math.random() * 12 + 3
        const newProgress = Math.min(prev + increment, 100)
        
        // Update loading message based on progress
        if (newProgress < 25) {
          setLoadingText(loadingMessages[0])
        } else if (newProgress < 50) {
          setLoadingText(loadingMessages[1])
        } else if (newProgress < 85) {
          setLoadingText(loadingMessages[2])
        } else {
          setLoadingText(loadingMessages[3])
        }
        
        return newProgress
      })
    }, 120)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* Main Content */}
      <div className="relative z-10 text-center w-full max-w-lg px-6">
        {/* Logo/Icon Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex justify-center"
        >
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner icon */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            {/* Sparkle effects */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite',
          }}
        >
          Portfolio
        </motion.h1>

        {/* Loading Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-10"
        >
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-gray-300 text-lg font-medium tracking-wide"
          >
            {loadingText}
          </motion.p>
        </motion.div>

        {/* Loading Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full"
        >
          {/* Progress Bar Track */}
          <div className="relative w-full h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50 backdrop-blur-sm shadow-inner">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Progress Fill */}
            <motion.div
              className="relative h-full loading-bar-shimmer rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
            </motion.div>
          </div>
          
          {/* Progress Percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between mt-4"
          >
            <span className="text-gray-500 text-xs font-medium tracking-wider uppercase">
              Progress
            </span>
            <motion.span
              key={Math.round(progress)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-white text-lg font-bold tabular-nums"
            >
              {Math.round(progress)}%
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500/50"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingScreen
