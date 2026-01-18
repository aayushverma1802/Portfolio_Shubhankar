import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to preload and track loading progress of GLB models
 * Preloads with drei FIRST, then tracks progress with XHR
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

    // Start drei's preload FIRST - this is critical
    const startPreload = async () => {
      try {
        // Check cache first
        const cache = useGLTF.cache || new Map()
        if (cache.has(modelUrl)) {
          setIsCached(true)
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 500)
          return
        }

        // Start drei's preload in background
        const preloadPromise = useGLTF.preload(modelUrl)
        
        // Track download with XHR for progress
        setProgress(5)
        let xhr = new XMLHttpRequest()
        xhr.open('GET', modelUrl, true)
        xhr.responseType = 'arraybuffer'

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

            // Wait for drei's preload to complete
            try {
              await preloadPromise
              setProgress(95)

              // Verify cache
              const verifyCache = useGLTF.cache || new Map()
              if (verifyCache.has(modelUrl)) {
                setProgress(100)
                // Wait longer to ensure drei's system is ready
                setTimeout(() => {
                  if (!cancelled) {
                    setLoading(false)
                  }
                }, 4000)
              } else {
                // Not cached, wait and check
                let attempts = 0
                const checkCache = () => {
                  attempts++
                  const checkAgain = useGLTF.cache || new Map()
                  if (checkAgain.has(modelUrl)) {
                    setProgress(100)
                    setTimeout(() => {
                      if (!cancelled) {
                        setLoading(false)
                      }
                    }, 4000)
                  } else if (attempts < 15) {
                    setTimeout(checkCache, 400)
                  } else {
                    setProgress(100)
                    setTimeout(() => {
                      if (!cancelled) {
                        setLoading(false)
                      }
                    }, 4000)
                  }
                }
                setTimeout(checkCache, 500)
              }
            } catch (preloadErr) {
              console.error('Preload error:', preloadErr)
              setProgress(100)
              setTimeout(() => {
                if (!cancelled) {
                  setLoading(false)
                }
              }, 4000)
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
      } catch (err) {
        if (!cancelled) {
          console.error('Start preload error:', err)
          setError(err)
          setLoading(false)
        }
      }
    }

    startPreload()

    return () => {
      cancelled = true
    }
  }, [modelUrl])

  return { loading, progress, error, isCached }
}
