import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function ScrollCamera() {
  const { camera } = useThree()
  const cameraPosition = useRef(new THREE.Vector3(0, 0, 5))
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5))
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const maxScroll = documentHeight - windowHeight
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    // Camera moves based on scroll progress
    const scroll = scrollProgress
    
    // Create smooth camera movement as user scrolls
    targetPosition.current.x = Math.sin(scroll * Math.PI * 2) * 2.5
    targetPosition.current.y = scroll * -4 + 1
    targetPosition.current.z = 5 + scroll * 4

    // Smooth camera interpolation
    camera.position.lerp(targetPosition.current, 0.08)
    
    // Camera rotation based on scroll
    camera.rotation.z = scroll * 0.15
    camera.rotation.y = scroll * 0.25
    
    // Look at center point that moves with scroll
    const lookAt = new THREE.Vector3(
      Math.sin(scroll * Math.PI) * 1,
      scroll * -2,
      -2 + scroll * -2
    )
    camera.lookAt(lookAt)
  })

  return null
}
