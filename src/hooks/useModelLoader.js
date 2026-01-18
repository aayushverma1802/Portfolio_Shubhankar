import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to preload and track loading progress of GLB models
 * Shows REAL progress based on actual download
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

    // Start drei's preload FIRST - critical for caching
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

        // CRITICAL: Wait for drei's preload to complete
        try {
          await preloadPromise
          setProgress(95)

          // Verify model is actually accessible
          const verifyCache = useGLTF.cache || new Map()
          const cachedModel = verifyCache.get(modelUrl)
          
          if (cachedModel && cachedModel.scene) {
            // Model is cached and has scene - ready!
            setProgress(100)
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 800)
          } else {
            // Not ready yet, keep checking
            let attempts = 0
            const checkReady = () => {
              if (cancelled) return
              attempts++
              const checkCache = useGLTF.cache || new Map()
              const model = checkCache.get(modelUrl)
              
              if (model && model.scene) {
                setProgress(100)
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 800)
              } else if (attempts < 25) {
                setTimeout(checkReady, 300)
              } else {
                // Give up after many attempts
                setProgress(100)
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 800)
              }
            }
            setTimeout(checkReady, 300)
          }
        } catch (preloadErr) {
          console.error('Preload error:', preloadErr)
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 1000)
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
