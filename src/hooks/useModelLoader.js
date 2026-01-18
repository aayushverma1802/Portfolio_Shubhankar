import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * Checks cache first - if cached, loads instantly
 * Uses XMLHttpRequest for reliable progress tracking on Vercel
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
        // Try to preload - if it's cached, this will resolve quickly
        const preloadPromise = useGLTF.preload(modelUrl)
        
        // Race with timeout to detect cached models
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 150))
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

    let xhr = null

    // Try cache first
    checkCache().then((wasCached) => {
      if (wasCached || cancelled) return

      // Not cached, download with progress tracking using XMLHttpRequest (more reliable on Vercel)
      setProgress(5)

      xhr = new XMLHttpRequest()
      
      xhr.open('GET', modelUrl, true)
      xhr.responseType = 'arraybuffer'
      
      // Track download progress
      xhr.addEventListener('progress', (e) => {
        if (cancelled) return
        
        if (e.lengthComputable && e.total > 0) {
          // Download progress: 5% to 90%
          const downloadProgress = 5 + (e.loaded / e.total) * 85
          setProgress(Math.min(90, downloadProgress))
        } else {
          // Estimate progress if total unknown (~17MB)
          const estimatedProgress = Math.min(90, 5 + (e.loaded / 18000000) * 85)
          setProgress(estimatedProgress)
        }
      })

      xhr.addEventListener('load', () => {
        if (cancelled) return

        try {
          const arrayBuffer = xhr.response
          const blob = new Blob([arrayBuffer])
          const url = URL.createObjectURL(blob)
          
          // Parse with GLTFLoader
          const loader = new GLTFLoader()
          loader.load(
            url,
            (gltf) => {
              if (!cancelled) {
                URL.revokeObjectURL(url)
                setProgress(100)
                
                // Cache it for next time
                try {
                  useGLTF.preload(modelUrl)
                } catch (err) {
                  console.warn('Preload cache warning:', err)
                }
                
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 300)
              }
            },
            (progressEvent) => {
              if (!cancelled) {
                // Parsing progress: 90% to 100%
                if (progressEvent.total > 0) {
                  const parseProgress = 90 + (progressEvent.loaded / progressEvent.total) * 10
                  setProgress(Math.min(100, parseProgress))
                } else {
                  setProgress(95)
                }
              }
            },
            (err) => {
              if (!cancelled) {
                URL.revokeObjectURL(url)
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
