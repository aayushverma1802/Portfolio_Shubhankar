import { useState, useEffect, useRef } from 'react'

// Shared scroll progress hook to avoid multiple scroll listeners
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef(null)
  const lastScrollTop = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const maxScroll = documentHeight - windowHeight
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
      
      // Only update if scroll changed significantly (throttle updates more aggressively)
      if (Math.abs(scrollTop - lastScrollTop.current) > 2) {
        lastScrollTop.current = scrollTop
        
        // Use RAF to batch updates - throttle more aggressively
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        rafRef.current = requestAnimationFrame(() => {
          setScrollProgress(progress)
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return scrollProgress
}
