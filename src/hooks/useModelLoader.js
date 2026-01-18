import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
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

    // Create loading manager to track progress
    const manager = new THREE.LoadingManager()
    let downloadProgress = 0
    let parseProgress = 0

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      if (!cancelled) {
        // Track download progress (first 80%)
        downloadProgress = (itemsLoaded / itemsTotal) * 80
        setProgress(downloadProgress + parseProgress)
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
          
          // Preload into drei cache for React Three Fiber (synchronous)
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
            setProgress(downloadProgress + parseProgress)
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
