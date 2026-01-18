import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to preload and track loading progress of GLB models
 * Downloads with XHR, then uses drei's preload to cache properly
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

    let xhr = null

    // Check if already cached
    const cache = useGLTF.cache || new Map()
    if (cache.has(modelUrl)) {
      setIsCached(true)
      setProgress(100)
      setTimeout(() => {
        if (!cancelled) {
          setLoading(false)
        }
      }, 500)
      return () => {
        cancelled = true
      }
    }

    // Download with XHR for progress tracking
    setProgress(5)

    xhr = new XMLHttpRequest()
    xhr.open('GET', modelUrl, true)
    xhr.responseType = 'arraybuffer'

    // Track download progress
    xhr.addEventListener('progress', (e) => {
      if (cancelled) return
      
      if (e.lengthComputable && e.total > 0) {
        const downloadProgress = 5 + (e.loaded / e.total) * 85
        setProgress(Math.min(90, downloadProgress))
      } else if (e.loaded > 0) {
        const estimatedProgress = Math.min(90, 5 + (e.loaded / 18000000) * 85)
        setProgress(estimatedProgress)
      }
    })

    xhr.addEventListener('load', async () => {
      if (cancelled) return

      try {
        setProgress(92)

        // CRITICAL: Call drei's preload - it will load from browser cache
        // This MUST complete successfully for useGLTF to find the model
        try {
          // Wait for drei's preload to complete
          await useGLTF.preload(modelUrl)
          
          setProgress(95)
          
          // Verify it's actually cached
          const verifyCache = useGLTF.cache || new Map()
          if (verifyCache.has(modelUrl)) {
            setProgress(100)
            
            // Wait longer to ensure drei's system is fully ready
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 3000)
          } else {
            // Not cached yet, wait and check again
            let attempts = 0
            const checkCache = () => {
              attempts++
              const checkCacheAgain = useGLTF.cache || new Map()
              if (checkCacheAgain.has(modelUrl)) {
                setProgress(100)
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 3000)
              } else if (attempts < 10) {
                setTimeout(checkCache, 500)
              } else {
                // Give up after 5 seconds
                setProgress(100)
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 3000)
              }
            }
            setTimeout(checkCache, 500)
          }
        } catch (preloadErr) {
          console.error('Preload error:', preloadErr)
          // Even if preload fails, wait and hope it cached
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 3000)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error:', err)
          setError(err)
          setLoading(false)
        }
      }
    })

    xhr.addEventListener('error', () => {
      if (!cancelled) {
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

    return () => {
      cancelled = true
      if (xhr) {
        xhr.abort()
      }
    }
  }, [modelUrl])

  return { loading, progress, error, isCached }
}
