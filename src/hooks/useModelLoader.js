import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * Always shows real-time progress - no cache blocking
 * Uses GLTFLoader with LoadingManager to track actual download and parse progress
 */
export function useModelPreloader(modelUrl) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!modelUrl) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setProgress(0)
    setError(null)

    // Start with a small initial progress to show something is happening
    setProgress(5)

    // Create loading manager to track progress
    const manager = new THREE.LoadingManager()
    let downloadProgress = 0
    let parseProgress = 0

    manager.onLoad = () => {
      if (!cancelled) {
        downloadProgress = 80
        setProgress(80)
      }
    }

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      if (!cancelled && itemsTotal > 0) {
        // Track download progress (first 80%)
        downloadProgress = (itemsLoaded / itemsTotal) * 80
        setProgress(Math.max(5, downloadProgress + parseProgress)) // Ensure at least 5%
      }
    }

    manager.onError = (url) => {
      if (!cancelled) {
        console.error('Loading manager error:', url)
      }
    }

    // Create loader with manager
    const loader = new GLTFLoader(manager)

    // Load the model
    loader.load(
      modelUrl,
      (gltf) => {
        if (!cancelled) {
          // Model loaded successfully
          parseProgress = 20 // Last 20% for parsing
          setProgress(100)
          
          // Preload into drei cache for React Three Fiber
          try {
            useGLTF.preload(modelUrl)
          } catch (err) {
            // Preload might fail if already cached, which is fine
            console.warn('Preload cache warning (non-critical):', err)
          }
          
          // Small delay to show 100% before hiding loader
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 300)
        }
      },
      (progressEvent) => {
        if (!cancelled) {
          // Track parsing progress (last 20%)
          if (progressEvent.total > 0) {
            parseProgress = (progressEvent.loaded / progressEvent.total) * 20
            setProgress(Math.min(100, downloadProgress + parseProgress))
          } else if (progressEvent.loaded > 0) {
            // If total is unknown, estimate based on loaded bytes
            // Assume ~17MB total, so estimate progress
            const estimatedProgress = Math.min(95, (progressEvent.loaded / 17000000) * 100)
            setProgress(Math.max(5, estimatedProgress))
          }
        }
      },
      (err) => {
        if (!cancelled) {
          console.error('Model loading error:', err)
          setError(err)
          setLoading(false)
        }
      }
    )

    return () => {
      cancelled = true
    }
  }, [modelUrl])

  return { loading, progress, error }
}
