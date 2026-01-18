import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollProgress } from '../hooks/useScrollProgress'

// Reusable vector objects to avoid GC
const tempVector = new THREE.Vector3()
const tempLookAt = new THREE.Vector3()

export default function ScrollCamera() {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(0, 0, 5))
  const scrollProgress = useScrollProgress()
  const scrollRef = useRef(0)

  useFrame((state, delta) => {
    // Smoothly interpolate scroll progress - use delta for frame-rate independent updates
    scrollRef.current += (scrollProgress - scrollRef.current) * Math.min(delta * 10, 0.15)
    const scroll = scrollRef.current
    
    // Create smooth camera movement as user scrolls
    targetPosition.current.x = Math.sin(scroll * Math.PI * 2) * 2.5
    targetPosition.current.y = scroll * -4 + 1
    targetPosition.current.z = 5 + scroll * 4

    // Smooth camera interpolation - use delta for consistency
    camera.position.lerp(targetPosition.current, Math.min(delta * 10, 0.1))
    
    // Camera rotation based on scroll
    camera.rotation.z = scroll * 0.15
    camera.rotation.y = scroll * 0.25
    
    // Look at center point that moves with scroll (reuse vector)
    tempLookAt.set(
      Math.sin(scroll * Math.PI) * 1,
      scroll * -2,
      -2 + scroll * -2
    )
    camera.lookAt(tempLookAt)
  })

  return null
}
