import React, { useRef, useEffect, Suspense, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from '../hooks/useScrollProgress'

// Reusable vector objects to avoid GC
const tempVector = new THREE.Vector3()

// F1 Car Model Loader Component (wrapped in Suspense)
function F1CarModel({ position, modelUrl, reverseDirection = false, scale = 0.15, rotationY = 0, otherCarPosition = null }) {
  const carRef = useRef()
  const scrollProgress = useScrollProgress()
  const { camera } = useThree()
  const scrollRef = useRef(0)
  
  // Load the GLTF model with caching
  const { scene } = useGLTF(modelUrl || '/models/f1-car.glb')

  // Find wheels and other parts for animation (memoized)
  const wheelsRef = useRef([])
  const headlightLeftRef = useRef()
  const headlightRightRef = useRef()

  // Optimize materials on load
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Optimize materials
          if (child.material) {
            // Convert to array if single material
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            materials.forEach((mat) => {
              if (mat) {
                // Disable shadows for better performance
                mat.shadowSide = THREE.FrontSide
                // Optimize materials for realistic look - proper metallic/roughness with brightness
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  // Realistic material properties
                  if (mat.roughness !== undefined) {
                    // Keep original roughness but ensure realistic range
                    mat.roughness = Math.max(0.1, Math.min(mat.roughness, 0.9))
                  }
                  // Set realistic metalness for car parts
                  if (mat.metalness !== undefined) {
                    mat.metalness = Math.max(0.3, Math.min(mat.metalness, 1.0))
                  } else {
                    // Default metalness for car body
                    mat.metalness = 0.7
                  }
                  // Add subtle emissive for better visibility
                  if (!mat.emissive || mat.emissive.getHex() === 0x000000) {
                    mat.emissive = new THREE.Color(0x333333)
                    mat.emissiveIntensity = 0.2
                  } else {
                    mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 0, 0.15)
                  }
                  // Brighten colors slightly for better visibility
                  if (mat.color) {
                    // Slightly brighten colors while keeping them realistic
                    mat.color.r = Math.min(mat.color.r * 1.1, 1.0)
                    mat.color.g = Math.min(mat.color.g * 1.1, 1.0)
                    mat.color.b = Math.min(mat.color.b * 1.1, 1.0)
                  }
                  // Enable proper lighting calculations
                  mat.needsUpdate = true
                }
              }
            })
          }
          
          // Disable shadows on meshes for performance
          child.castShadow = false
          child.receiveShadow = false
          
          const name = child.name.toLowerCase()
          // More comprehensive wheel finding - try to find all wheel-like objects
          if (name.includes('wheel') || name.includes('tire') || name.includes('rim') || 
              name.includes('tyre') || name.includes('whl') || name.includes('wheel_fl') ||
              name.includes('wheel_fr') || name.includes('wheel_rl') || name.includes('wheel_rr')) {
            wheelsRef.current.push(child)
          }
          if (name.includes('headlight') || name.includes('light')) {
            if (!headlightLeftRef.current) {
              headlightLeftRef.current = child
            } else if (!headlightRightRef.current) {
              headlightRightRef.current = child
            }
          }
        }
      })
    }
  }, [scene, modelUrl])
  
  // Clone scene once and memoize - optimize for performance
  const clonedScene = useMemo(() => {
    if (scene) {
      const cloned = scene.clone(true) // Deep clone
      // Optimize cloned scene for performance
      cloned.traverse((child) => {
        if (child.isMesh) {
          // Ensure frustum culling is enabled
          child.frustumCulled = true
          // Optimize geometry
          if (child.geometry) {
            child.geometry.computeBoundingSphere()
            child.geometry.computeBoundingBox()
            // Merge vertices if possible for better performance
            if (child.geometry.attributes && !child.geometry.attributes.normal) {
              child.geometry.computeVertexNormals()
            }
          }
          // Optimize material
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            materials.forEach((mat) => {
              if (mat) {
                mat.precision = 'highp'
                mat.needsUpdate = true
              }
            })
          }
        }
      })
      return cloned
    }
    return null
  }, [scene])

  useFrame((state, delta) => {
    if (!carRef.current) return
    
    // Smoothly interpolate scroll progress - use delta for frame-rate independence
    scrollRef.current += (scrollProgress - scrollRef.current) * Math.min(delta * 10, 0.15)
    const scroll = scrollRef.current
    
    // Counter-rotate the car to compensate for camera rotation
    const cameraRotationY = camera.rotation.y
    const cameraRotationZ = camera.rotation.z
    
    // Rotate cars around each other in orbit - they stay in same position but rotate
    if (otherCarPosition) {
      // Calculate center point between the two cars
      const centerX = (position[0] + otherCarPosition[0]) * 0.5
      const centerZ = (position[2] + otherCarPosition[2]) * 0.5
      
      // Calculate angle for orbital rotation based on scroll progress
      const orbitAngle = scroll * Math.PI * 2
      
      // Calculate radius from center to this car's base position
      const radiusX = position[0] - centerX
      const radiusZ = position[2] - centerZ
      const radius = Math.sqrt(radiusX * radiusX + radiusZ * radiusZ)
      
      // Calculate initial angle of this car relative to center
      const initialAngle = Math.atan2(radiusX, radiusZ)
      
      // Calculate new position in orbit (cars rotate around center)
      const newAngle = initialAngle + orbitAngle
      carRef.current.position.x = centerX + radius * Math.sin(newAngle)
      carRef.current.position.y = position[1]
      carRef.current.position.z = centerZ + radius * Math.cos(newAngle)
      
      // Calculate direction to the other car for facing
      const otherAngle = initialAngle + orbitAngle + Math.PI
      const otherX = centerX + radius * Math.sin(otherAngle)
      const otherZ = centerZ + radius * Math.cos(otherAngle)
      
      // Calculate angle to face the other car
      tempVector.set(otherX - carRef.current.position.x, 0, otherZ - carRef.current.position.z)
      const angleToOther = Math.atan2(tempVector.x, tempVector.z)
      
      // Rotate car to face the other car, compensating for camera rotation
      carRef.current.rotation.y = -cameraRotationY + angleToOther
    } else {
      // Single car - stay in fixed X/Z position, move down when scrolling, rotate on its own axis
      carRef.current.position.x = position[0]
      carRef.current.position.y = position[1] - scroll * 2
      carRef.current.position.z = position[2]
      
      // Rotate car on its Y axis based on scroll progress (full 360 rotation)
      const rotationAmount = scroll * Math.PI * 2
      carRef.current.rotation.y = -cameraRotationY + rotationAmount
    }
    
    carRef.current.rotation.z = -cameraRotationZ
    carRef.current.rotation.x = 0
  })

  if (!clonedScene) return null

  return (
    <group 
      ref={carRef} 
      position={position}
    >
      <primitive 
        object={clonedScene} 
        scale={scale}
        rotation={[0, rotationY, 0]}
      />
      
      {/* Add headlights if not in model - optimized for performance */}
      {!headlightLeftRef.current && (
        <group position={[0.045, 0.0075, 0.405]}>
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.0075, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={6.0}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={3} distance={20} decay={2} />
        </group>
      )}
      
      {!headlightRightRef.current && (
        <group position={[-0.045, 0.0075, 0.405]}>
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.0075, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={6.0}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={3} distance={20} decay={2} />
        </group>
      )}
    </group>
  )
}

// F1 Car Component with error handling
function F1Car({ position = [0, 0, -2], modelUrl, reverseDirection = false, scale = 0.15, rotationY = 0, otherCarPosition = null }) {
  return (
    <Suspense fallback={null}>
      <F1CarModel position={position} modelUrl={modelUrl} reverseDirection={reverseDirection} scale={scale} rotationY={rotationY} otherCarPosition={otherCarPosition} />
    </Suspense>
  )
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log('3D Model loading error (this is normal if model file is missing):', error)
  }

  render() {
    if (this.state.hasError) {
      // Silently fail - model file doesn't exist yet
      return null
    }

    return this.props.children
  }
}

// Optimized lighting component - fewer lights but brighter for performance
function DynamicLighting({ scrollProgress }) {
  const ambientRef = useRef()
  const point1Ref = useRef()
  const point2Ref = useRef()
  const directionalRef = useRef()
  const sphereRef = useRef()
  const scrollRef = useRef(0)

  useFrame((state, delta) => {
    // Smooth scroll interpolation - use delta for frame-rate independence
    scrollRef.current += (scrollProgress - scrollRef.current) * Math.min(delta * 10, 0.2)
    const scroll = scrollRef.current

    // Update lighting intensities - brighter with scroll animation
    if (ambientRef.current) {
      ambientRef.current.intensity = 2.0 + scroll * 0.3
    }
    if (point1Ref.current) {
      point1Ref.current.intensity = 6.0 + scroll * 2.0
    }
    if (point2Ref.current) {
      point2Ref.current.intensity = 4.5 + scroll * 1.8
    }
    if (directionalRef.current) {
      directionalRef.current.intensity = 4.0 + scroll * 1.5
    }
    if (sphereRef.current && sphereRef.current.material) {
      sphereRef.current.material.opacity = 0.1 + scroll * 0.15
    }
  })

  return (
    <>
      {/* Bright realistic studio lighting setup for car */}
      <ambientLight ref={ambientRef} intensity={2.0} />
      {/* Key light - main illumination */}
      <pointLight 
        ref={point1Ref}
        position={[8, 8, 8]} 
        intensity={6.0}
        color="#ffffff"
        distance={100}
        decay={2}
      />
      {/* Fill light - softer secondary light */}
      <pointLight 
        ref={point2Ref}
        position={[-6, 4, -6]} 
        intensity={4.5}
        color="#ffffff"
        distance={100}
        decay={2}
      />
      {/* Rim light - edge definition */}
      <directionalLight
        ref={directionalRef}
        position={[5, 10, 5]}
        intensity={4.0}
        color="#ffffff"
      />

      {/* Background gradient sphere - minimal geometry for performance */}
      <Sphere ref={sphereRef} args={[50, 8, 8]} position={[0, 0, -50]}>
        <meshBasicMaterial 
          color="#0a0a0a" 
          opacity={0.1} 
          transparent 
        />
      </Sphere>
    </>
  )
}

// Main enhanced scene with F1 Car
export default function EnhancedScene3D() {
  const scrollProgress = useScrollProgress()
  
  // Preload GLTF models for better performance
  useEffect(() => {
    try {
      useGLTF.preload('/models/f1-car.glb')
    } catch (e) {
      // Silently fail if model doesn't exist yet
    }
  }, [])
  
  // You can use a URL to a free F1 car model or put it in public/models/
  const f1ModelUrl = '/models/f1-car.glb' // First F1 car GLB file
  const f1ModelUrl2 = '/models/f1-car-2.glb' // Second F1 car GLB file

  return (
    <>
      <DynamicLighting scrollProgress={scrollProgress} />

      {/* Main F1 Car - loads real GLTF model with error handling */}
      <ErrorBoundary>
        <F1Car position={[0, -0.5, -2]} modelUrl={f1ModelUrl} reverseDirection={false} scale={0.15} />
      </ErrorBoundary>
      
      {/* Second F1 Car - removed for now */}
      {/* <ErrorBoundary>
        <F1Car position={[3.5, 0, -1.5]} modelUrl={f1ModelUrl2} reverseDirection={true} scale={1.0} rotationY={0} otherCarPosition={[0, 0, -2]} />
      </ErrorBoundary> */}
    </>
  )
}
