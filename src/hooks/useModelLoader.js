import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * Uses XMLHttpRequest for reliable progress tracking on Vercel
 * Ensures model is FULLY loaded before allowing site to start
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

    // Check if model is already cached in drei's cache
    const checkCache = async () => {
      try {
        const cache = useGLTF.cache || new Map()
        if (cache.has(modelUrl)) {
          if (!cancelled) {
            setIsCached(true)
            setProgress(100)
            // Verify it's actually ready by calling preload
            try {
              await useGLTF.preload(modelUrl)
              if (!cancelled) {
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 200)
                return true
              }
            } catch (err) {
              // Cache might be stale, continue with loading
            }
          }
        }

        // Try preload with timeout - if cached, resolves quickly
        const preloadPromise = useGLTF.preload(modelUrl)
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 300))
        const result = await Promise.race([preloadPromise, timeoutPromise])
        
        if (result !== 'timeout' && !cancelled) {
          setIsCached(true)
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 200)
          return true
        }
      } catch (err) {
        // Not cached, continue with download
      }
      return false
    }

    let xhr = null

    // Check cache first
    checkCache().then((wasCached) => {
      if (wasCached || cancelled) return

      // Not cached - download with XMLHttpRequest for reliable progress on Vercel
      setProgress(5)

      xhr = new XMLHttpRequest()
      xhr.open('GET', modelUrl, true)
      xhr.responseType = 'arraybuffer'

      // Track download progress (5% to 85%)
      xhr.addEventListener('progress', (e) => {
        if (cancelled) return
        
        if (e.lengthComputable && e.total > 0) {
          const downloadProgress = 5 + (e.loaded / e.total) * 80
          setProgress(Math.min(85, downloadProgress))
        } else {
          // Estimate based on typical file size (~17MB)
          const estimatedProgress = Math.min(85, 5 + (e.loaded / 18000000) * 80)
          setProgress(estimatedProgress)
        }
      })

      xhr.addEventListener('load', () => {
        if (cancelled) return

        try {
          const arrayBuffer = xhr.response
          setProgress(87)

          // Parse with GLTFLoader
          const loader = new GLTFLoader()
          loader.parse(
            arrayBuffer,
            modelUrl,
            async (gltf) => {
              if (!cancelled) {
                setProgress(95)

                // Store in drei's cache
                try {
                  const cache = useGLTF.cache || new Map()
                  cache.set(modelUrl, gltf)
                  
                  // CRITICAL: Wait for drei's preload to complete
                  // This ensures the model is fully ready
                  await useGLTF.preload(modelUrl)
                  
                  setProgress(100)
                  
                  // Small delay to ensure everything is ready
                  setTimeout(() => {
                    if (!cancelled) {
                      setLoading(false)
                    }
                  }, 500)
                } catch (err) {
                  console.error('Cache/preload error:', err)
                  // Even if preload fails, model is parsed - continue
                  setProgress(100)
                  setTimeout(() => {
                    if (!cancelled) {
                      setLoading(false)
                    }
                  }, 500)
                }
              }
            },
            (err) => {
              if (!cancelled) {
                console.error('GLTF parsing error:', err)
                setError(err)
                setLoading(false)
              }
            }
          )
        } catch (err) {
          if (!cancelled) {
            console.error('XHR load error:', err)
            setError(err)
            setLoading(false)
          }
        }
      })

      xhr.addEventListener('error', () => {
        if (!cancelled) {
          console.error('XHR error loading model')
          setError(new Error('Failed to load model'))
          setLoading(false)
        }
      })

      xhr.addEventListener('abort', () => {
        if (!cancelled) {
          setLoading(false)
        }
      })

      xhr.send()
    })

    return () => {
      cancelled = true
      if (xhr) {
        xhr.abort()
      }
    }
  }, [modelUrl])

  return { loading, progress, error, isCached }
}
