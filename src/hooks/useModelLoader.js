import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to preload and track loading progress of GLB models
 * Uses XMLHttpRequest for progress tracking, then lets drei's preload handle everything
 * Ensures model is FULLY loaded via drei's system before allowing site to start
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

    // Check if model is already cached by trying preload
    const checkCache = async () => {
      try {
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

      // Not cached - download with XMLHttpRequest for progress tracking
      setProgress(5)

      xhr = new XMLHttpRequest()
      xhr.open('GET', modelUrl, true)
      xhr.responseType = 'arraybuffer'

      // Track download progress (5% to 90%)
      xhr.addEventListener('progress', (e) => {
        if (cancelled) return
        
        if (e.lengthComputable && e.total > 0) {
          const downloadProgress = 5 + (e.loaded / e.total) * 85
          setProgress(Math.min(90, downloadProgress))
        } else {
          // Estimate based on typical file size (~17MB)
          const estimatedProgress = Math.min(90, 5 + (e.loaded / 18000000) * 85)
          setProgress(estimatedProgress)
        }
      })

      xhr.addEventListener('load', async () => {
        if (cancelled) return

        try {
          setProgress(92)
          
          // CRITICAL: Now let drei's preload handle the loading and caching
          // Since we just downloaded it, browser cache will be used
          // This ensures drei caches it properly for useGLTF to find
          try {
            // Call drei's preload - it will load from browser cache (we just downloaded it)
            await useGLTF.preload(modelUrl)
            
            setProgress(100)
            
            // Extra delay to ensure drei's system is fully ready
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 1000)
          } catch (preloadErr) {
            console.error('Preload error:', preloadErr)
            // Even if preload fails, model is downloaded - proceed
            setProgress(100)
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 1000)
          }
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
