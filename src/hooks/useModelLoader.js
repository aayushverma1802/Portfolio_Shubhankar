import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Hook to preload and track loading progress of GLB models
 * Downloads with XHR for real progress, then caches properly for drei
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

    // Quick cache check
    const checkCache = async () => {
      try {
        const cache = useGLTF.cache || new Map()
        if (cache.has(modelUrl)) {
          const preloadPromise = useGLTF.preload(modelUrl)
          const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 200))
          const result = await Promise.race([preloadPromise, timeoutPromise])
          
          if (result !== 'timeout' && !cancelled) {
            setIsCached(true)
            setProgress(100)
            setTimeout(() => {
              if (!cancelled) {
                setLoading(false)
              }
            }, 300)
            return true
          }
        }
      } catch (err) {
        // Not cached
      }
      return false
    }

    let xhr = null

    checkCache().then((wasCached) => {
      if (wasCached || cancelled) return

      // Download with XHR - show REAL progress
      setProgress(5)

      xhr = new XMLHttpRequest()
      xhr.open('GET', modelUrl, true)
      xhr.responseType = 'arraybuffer'

      // Real download progress tracking
      xhr.addEventListener('progress', (e) => {
        if (cancelled) return
        
        if (e.lengthComputable && e.total > 0) {
          // Download: 5% to 85%
          const downloadProgress = 5 + (e.loaded / e.total) * 80
          setProgress(Math.min(85, downloadProgress))
        } else {
          // Estimate: ~17MB file
          const estimatedProgress = Math.min(85, 5 + (e.loaded / 18000000) * 80)
          setProgress(estimatedProgress)
        }
      })

      xhr.addEventListener('load', () => {
        if (cancelled) return

        try {
          const arrayBuffer = xhr.response
          setProgress(87)

          // Parse the model
          const loader = new GLTFLoader()
          loader.parse(
            arrayBuffer,
            modelUrl,
            async (gltf) => {
              if (!cancelled) {
                setProgress(95)

                // CRITICAL: Cache in drei's system
                const cache = useGLTF.cache || new Map()
                cache.set(modelUrl, gltf)

                // Now call drei's preload to ensure it's recognized
                try {
                  await useGLTF.preload(modelUrl)
                } catch (preloadErr) {
                  // Model is cached, drei should find it
                  console.log('Preload note:', preloadErr.message || 'Model cached')
                }

                setProgress(100)

                // CRITICAL: Wait and verify model is ready
                setTimeout(() => {
                  if (!cancelled) {
                    // Double-check cache
                    const verifyCache = useGLTF.cache || new Map()
                    if (verifyCache.has(modelUrl)) {
                      setLoading(false)
                    } else {
                      // Not in cache, wait more
                      setTimeout(() => {
                        if (!cancelled) {
                          setLoading(false)
                        }
                      }, 500)
                    }
                  }
                }, 1500)
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
