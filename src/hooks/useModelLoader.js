import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * Uses XMLHttpRequest for reliable progress tracking on Vercel
 * Ensures model is FULLY loaded and available in drei's cache before allowing site to start
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

    // Check if model is already cached
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

      xhr.addEventListener('load', async () => {
        if (cancelled) return

        try {
          const arrayBuffer = xhr.response
          setProgress(87)

          // CRITICAL: Use drei's preload directly with the original URL
          // This ensures proper caching in drei's system
          // We'll let drei handle the actual loading, but we've already downloaded it
          // So we'll create a temporary blob URL and let drei load from that,
          // then replace it in cache with the original URL
          
          const blob = new Blob([arrayBuffer])
          const blobUrl = URL.createObjectURL(blob)
          
          // Load using drei's system by calling preload with blob URL first
          // Then we'll manually cache it with the original URL
          const loader = new GLTFLoader()
          
          loader.load(
            blobUrl,
            async (gltf) => {
              if (!cancelled) {
                setProgress(95)
                URL.revokeObjectURL(blobUrl)
                
                // Store in drei's cache with the ORIGINAL URL
                // This is critical - drei's useGLTF will look for the original URL
                const cache = useGLTF.cache || new Map()
                cache.set(modelUrl, gltf)
                
                // Now call preload with original URL - should use cached version
                // But if it doesn't, it will load from network (which is fine since we have it)
                try {
                  await useGLTF.preload(modelUrl)
                } catch (preloadErr) {
                  // If preload fails, the cache entry should still work
                  console.log('Preload note:', preloadErr.message || 'Model cached manually')
                }
                
                setProgress(100)
                
                // Extra delay to ensure drei's system recognizes the cache
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 1200)
              }
            },
            (progressEvent) => {
              if (!cancelled) {
                // Parsing progress: 87% to 95%
                if (progressEvent.total > 0) {
                  const parseProgress = 87 + (progressEvent.loaded / progressEvent.total) * 8
                  setProgress(Math.min(95, parseProgress))
                } else {
                  setProgress(90)
                }
              }
            },
            (err) => {
              if (!cancelled) {
                URL.revokeObjectURL(blobUrl)
                console.error('GLTF loading error:', err)
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
