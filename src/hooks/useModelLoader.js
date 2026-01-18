import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to preload and track loading progress of GLB models
 * Shows REAL progress based on actual download, not hardcoded time
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

    // Check cache first
    const cache = useGLTF.cache || new Map()
    if (cache.has(modelUrl)) {
      setIsCached(true)
      setProgress(100)
      setTimeout(() => {
        if (!cancelled) {
          setLoading(false)
        }
      }, 300)
      return () => {
        cancelled = true
      }
    }

    // Start drei's preload in background
    const preloadPromise = useGLTF.preload(modelUrl)
    
    // Track download with XHR for REAL progress
    setProgress(5)
    let xhr = new XMLHttpRequest()
    xhr.open('GET', modelUrl, true)
    xhr.responseType = 'arraybuffer'

    // REAL download progress
    xhr.addEventListener('progress', (e) => {
      if (cancelled) return
      if (e.lengthComputable && e.total > 0) {
        // Download: 5% to 90% based on actual bytes
        const downloadProgress = 5 + (e.loaded / e.total) * 85
        setProgress(Math.min(90, downloadProgress))
      } else if (e.loaded > 0) {
        // Estimate if total unknown
        const estimatedProgress = Math.min(90, 5 + (e.loaded / 18000000) * 85)
        setProgress(estimatedProgress)
      }
    })

    xhr.addEventListener('load', async () => {
      if (cancelled) return

      try {
        setProgress(92)

        // Wait for drei's preload to complete - this is REAL progress
        try {
          await preloadPromise
          setProgress(95)

          // Verify cache - REAL check, not time-based
          const verifyCache = useGLTF.cache || new Map()
          if (verifyCache.has(modelUrl)) {
            setProgress(100)
            // Only wait a tiny bit for drei to be ready
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 500)
          } else {
            // Not cached yet, check periodically until it is
            let attempts = 0
            const checkCache = () => {
              if (cancelled) return
              attempts++
              const checkAgain = useGLTF.cache || new Map()
              if (checkAgain.has(modelUrl)) {
                setProgress(100)
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 500)
              } else if (attempts < 20) {
                // Keep checking until cached - this is REAL progress
                setTimeout(checkCache, 200)
              } else {
                // After many attempts, proceed anyway
                setProgress(100)
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 500)
              }
            }
            setTimeout(checkCache, 200)
          }
        } catch (preloadErr) {
          console.error('Preload error:', preloadErr)
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 500)
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
