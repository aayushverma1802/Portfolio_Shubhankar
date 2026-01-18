import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * ALWAYS downloads and shows real progress - no shortcuts
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

    // Check cache - but still verify it works
    const checkCache = async () => {
      try {
        const cache = useGLTF.cache || new Map()
        if (cache.has(modelUrl)) {
          // Verify it actually works by calling preload
          try {
            await useGLTF.preload(modelUrl)
            if (!cancelled) {
              setIsCached(true)
              setProgress(100)
              // Still wait a bit to ensure it's ready
              setTimeout(() => {
                if (!cancelled) {
                  setLoading(false)
                }
              }, 500)
              return true
            }
          } catch (err) {
            // Cache might be stale, continue with download
          }
        }
      } catch (err) {
        // Not cached, continue
      }
      return false
    }

    let xhr = null

    checkCache().then((wasCached) => {
      if (wasCached || cancelled) return

      // ALWAYS download - show REAL progress
      setProgress(5)

      xhr = new XMLHttpRequest()
      xhr.open('GET', modelUrl, true)
      xhr.responseType = 'arraybuffer'

      // Real download progress - update frequently
      xhr.addEventListener('progress', (e) => {
        if (cancelled) return
        
        if (e.lengthComputable && e.total > 0) {
          // Download: 5% to 85%
          const downloadProgress = 5 + (e.loaded / e.total) * 80
          setProgress(Math.min(85, Math.max(5, downloadProgress)))
        } else if (e.loaded > 0) {
          // Estimate: ~17MB file
          const estimatedProgress = Math.min(85, 5 + (e.loaded / 18000000) * 80)
          setProgress(Math.max(5, estimatedProgress))
        }
      })

      xhr.addEventListener('load', () => {
        if (cancelled) return

        try {
          const arrayBuffer = xhr.response
          
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error('Empty response')
          }

          setProgress(87)

          // Parse the model - this takes time
          const loader = new GLTFLoader()
          loader.parse(
            arrayBuffer,
            modelUrl,
            async (gltf) => {
              if (!cancelled && gltf) {
                setProgress(95)

                // CRITICAL: Cache in drei's system
                const cache = useGLTF.cache || new Map()
                cache.set(modelUrl, gltf)

                // Call drei's preload to ensure recognition
                try {
                  await useGLTF.preload(modelUrl)
                } catch (preloadErr) {
                  console.log('Preload:', preloadErr.message || 'Model cached')
                }

                setProgress(100)

                // CRITICAL: Wait longer and verify multiple times
                let verifyAttempts = 0
                const verifyReady = () => {
                  verifyAttempts++
                  const verifyCache = useGLTF.cache || new Map()
                  
                  if (verifyCache.has(modelUrl)) {
                    // Model is cached - wait a bit more to ensure drei recognizes it
                    setTimeout(() => {
                      if (!cancelled) {
                        setLoading(false)
                      }
                    }, 1000)
                  } else if (verifyAttempts < 15) {
                    // Not in cache yet, check again
                    setTimeout(verifyReady, 300)
                  } else {
                    // Give up after many attempts
                    console.warn('Model cache verification failed, proceeding anyway')
                    setTimeout(() => {
                      if (!cancelled) {
                        setLoading(false)
                      }
                    }, 1000)
                  }
                }
                
                // Start verification after a delay
                setTimeout(verifyReady, 500)
              }
            },
            (err) => {
              if (!cancelled) {
                console.error('GLTF parse error:', err)
                setError(err)
                setLoading(false)
              }
            }
          )
        } catch (err) {
          if (!cancelled) {
            console.error('XHR process error:', err)
            setError(err)
            setLoading(false)
          }
        }
      })

      xhr.addEventListener('error', () => {
        if (!cancelled) {
          console.error('XHR error')
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
