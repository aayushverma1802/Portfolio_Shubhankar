import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Hook to preload and track loading progress of GLB models
 * Uses drei's preload directly and tracks progress via XHR
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

    // Track download with XHR for progress, then use drei's preload
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
      }, 300)
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
        const downloadProgress = 5 + (e.loaded / e.total) * 90
        setProgress(Math.min(95, downloadProgress))
      } else if (e.loaded > 0) {
        const estimatedProgress = Math.min(95, 5 + (e.loaded / 18000000) * 90)
        setProgress(estimatedProgress)
      }
    })

    xhr.addEventListener('load', async () => {
      if (cancelled) return

      try {
        setProgress(95)

        // CRITICAL: Use drei's preload - it will use browser cache
        // This ensures proper caching for useGLTF
        try {
          await useGLTF.preload(modelUrl)
          setProgress(100)
          
          // Wait to ensure drei's system is ready
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 2000)
        } catch (preloadErr) {
          console.error('Preload error:', preloadErr)
          setProgress(100)
          setTimeout(() => {
            if (!cancelled) {
              setLoading(false)
            }
          }, 2000)
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
