import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * Checks cache first - if cached, loads instantly
 * Uses drei's loader system for proper caching on Vercel
 */
export function useModelPreloader(modelUrl) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [isCached, setIsCached] = useState(false)

  useEffect(() => {
    if (!modelUrl) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setProgress(0)
    setError(null)
    setIsCached(false)

    // First, try to check if model is already cached
    const checkCache = async () => {
      try {
        // Check if already in drei's cache
        const cache = useGLTF.cache || new Map()
        if (cache.has(modelUrl)) {
          if (!cancelled) {
            setIsCached(true)
            setProgress(100)
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 100)
            return true
          }
        }

        // Try to preload - if it's cached, this will resolve quickly
        const preloadPromise = useGLTF.preload(modelUrl)
        
        // Race with timeout to detect cached models
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 200))
        const result = await Promise.race([preloadPromise, timeoutPromise])
        
        if (result !== 'timeout' && !cancelled) {
          // Model is cached!
          setIsCached(true)
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 100)
          return true
        }
      } catch (err) {
        // Not cached, continue with normal loading
      }
      return false
    }

    // Try cache first
    checkCache().then((wasCached) => {
      if (wasCached || cancelled) return

      // Not cached, download with progress tracking using drei's loader system
      setProgress(5)

      // Use drei's loader with LoadingManager for progress tracking
      const manager = new THREE.LoadingManager()
      let downloadProgress = 0

      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        if (!cancelled && itemsTotal > 0) {
          // Download progress: 5% to 85%
          downloadProgress = 5 + (itemsLoaded / itemsTotal) * 80
          setProgress(Math.min(85, downloadProgress))
        }
      }

      manager.onLoad = () => {
        if (!cancelled) {
          setProgress(85)
        }
      }

      manager.onError = (url) => {
        if (!cancelled) {
          console.error('Loading manager error:', url)
        }
      }

      // Use drei's loader (which uses GLTFLoader internally)
      const loader = new GLTFLoader(manager)

      // Load directly from URL - drei will cache it automatically
      loader.load(
        modelUrl,
        async (gltf) => {
          if (!cancelled) {
            setProgress(95)
            
            // Ensure drei's cache has it
            try {
              const cache = useGLTF.cache || new Map()
              cache.set(modelUrl, gltf)
              
              // Preload to ensure drei recognizes it
              await useGLTF.preload(modelUrl)
            } catch (err) {
              // Model is cached manually, drei will use it
              console.log('Cache note:', err.message || 'Model cached')
            }
            
            setProgress(100)
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 300)
          }
        },
        (progressEvent) => {
          if (!cancelled) {
            // Parsing progress: 85% to 100%
            if (progressEvent.total > 0) {
              const parseProgress = 85 + (progressEvent.loaded / progressEvent.total) * 15
              setProgress(Math.min(100, parseProgress))
            } else {
              setProgress(90)
            }
          }
        },
        (err) => {
          if (!cancelled) {
            console.error('GLTF loading error:', err)
            setError(err)
            setLoading(false)
          }
        }
      )
    })

    return () => {
      cancelled = true
    }
  }, [modelUrl])

  return { loading, progress, error, isCached }
}
