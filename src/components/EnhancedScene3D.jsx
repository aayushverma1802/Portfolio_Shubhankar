import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  MeshDistortMaterial, 
  Sphere, 
  Box, 
  Torus, 
  Cylinder,
  Octahedron,
  Icosahedron,
  TorusKnot,
  Cone,
  Tube
} from '@react-three/drei'
import * as THREE from 'three'

// Hook to get scroll progress
function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const maxScroll = documentHeight - windowHeight
      setScrollProgress(maxScroll > 0 ? scrollTop / maxScroll : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}

// Hook to get section scroll progress
function useSectionProgress(sectionId) {
  const [progress, setProgress] = useState(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(sectionId)
      if (!element) return

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
      )

      setProgress(scrollProgress)
      setIsInView(rect.top < windowHeight && rect.bottom > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionId])

  return { progress, isInView }
}

// Scroll-reactive rotating gear
function ScrollReactiveGear({ position, rotationSpeed = 0.01, scrollMultiplier = 1 }) {
  const meshRef = useRef()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const maxScroll = documentHeight - windowHeight
      setScrollProgress(maxScroll > 0 ? scrollTop / maxScroll : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      const speed = rotationSpeed * (1 + scrollProgress * scrollMultiplier * 5)
      meshRef.current.rotation.z += speed
      meshRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.5
    }
  })

  return (
    <Torus
      ref={meshRef}
      args={[1, 0.3, 16, 100]}
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial 
        color="#3b82f6" 
        metalness={0.9} 
        roughness={0.1}
        emissive="#1e40af"
        emissiveIntensity={0.3}
      />
    </Torus>
  )
}

// Scroll-reactive floating sphere
function ScrollFloatingSphere({ position, color, sectionId }) {
  const meshRef = useRef()
  const { progress, isInView } = useSectionProgress(sectionId)
  const scrollProgress = useScrollProgress()

  useFrame((state) => {
    if (meshRef.current) {
      const baseY = position[1]
      const floatAmount = Math.sin(state.clock.elapsedTime + scrollProgress * 10) * 0.8
      const scrollOffset = scrollProgress * -5
      
      meshRef.current.position.y = baseY + floatAmount + scrollOffset
      meshRef.current.position.x = position[0] + Math.sin(scrollProgress * Math.PI * 2) * 2
      meshRef.current.rotation.x += 0.02 * (1 + progress)
      meshRef.current.rotation.y += 0.02 * (1 + progress)
      
      // Scale based on scroll progress
      const scale = 1 + Math.sin(scrollProgress * Math.PI * 4) * 0.3
      meshRef.current.scale.set(scale, scale, scale)
      
      // Visibility based on section
      meshRef.current.visible = isInView || scrollProgress < 0.3
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.6, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        distort={0.4 + scrollProgress * 0.3}
        speed={2 + scrollProgress * 3}
        roughness={0.5}
        metalness={0.8}
      />
    </Sphere>
  )
}

// Complex mechanical assembly with scroll animations
function ScrollMechanicalAssembly({ position, sectionId }) {
  const groupRef = useRef()
  const { progress, isInView } = useSectionProgress(sectionId)
  const scrollProgress = useScrollProgress()

  useFrame(() => {
    if (groupRef.current) {
      const baseRotation = scrollProgress * Math.PI
      const sectionRotation = progress * Math.PI * 2
      groupRef.current.rotation.y = baseRotation + sectionRotation * 0.5
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.3
      
      // Position animation based on scroll
      groupRef.current.position.y = position[1] + Math.sin(scrollProgress * Math.PI * 2) * 1
      groupRef.current.position.z = position[2] + scrollProgress * -2
      
      // Visibility
      groupRef.current.visible = isInView || scrollProgress < 0.5
    }
  })

  const rodPositions = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const angle = (Math.PI * 2 * i) / 6
      return {
        angle,
        position: [Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2],
        rotation: [0, angle, Math.PI / 2],
      }
    })
  }, [])

  return (
    <group ref={groupRef} position={position}>
      {/* Central cylinder */}
      <Cylinder args={[0.4, 0.4, 2.5, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#8b5cf6" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#4c1d95"
          emissiveIntensity={0.4}
        />
      </Cylinder>
      
      {/* Rotating gears */}
      <ScrollReactiveGear position={[0, 1.5, 0]} rotationSpeed={0.03} />
      <ScrollReactiveGear position={[0, -1.5, 0]} rotationSpeed={-0.03} />
      
      {/* Connecting rods */}
      {rodPositions.map((rod, i) => (
        <Cylinder
          key={i}
          args={[0.08, 0.08, 1.5, 16]}
          position={rod.position}
          rotation={rod.rotation}
        >
          <meshStandardMaterial 
            color="#ec4899" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#be185d"
            emissiveIntensity={0.3}
          />
        </Cylinder>
      ))}
    </group>
  )
}

// Robot arm with scroll animation
function ScrollRobotArm({ position, sectionId }) {
  const groupRef = useRef()
  const { progress } = useSectionProgress(sectionId)

  useFrame(() => {
    if (groupRef.current) {
      // Animate arm movement based on scroll
      const baseAngle = progress * Math.PI * 2
      groupRef.current.rotation.y = baseAngle
      groupRef.current.children[0].rotation.z = Math.sin(baseAngle) * 0.5
      if (groupRef.current.children[1]) {
        groupRef.current.children[1].rotation.z = -Math.sin(baseAngle * 1.5) * 0.3
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <Cylinder args={[0.3, 0.3, 0.5, 16]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* First segment */}
      <Cylinder args={[0.15, 0.15, 1.5, 16]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#f97316" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* Second segment */}
      <group position={[0.75, 0, 0]}>
        <Cylinder args={[0.12, 0.12, 1.2, 16]} position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* End effector */}
        <Box args={[0.3, 0.3, 0.3]} position={[1.2, 0, 0]}>
          <meshStandardMaterial color="#10b981" metalness={0.9} roughness={0.1} />
        </Box>
      </group>
    </group>
  )
}

// Engine block with pistons
function ScrollEngineBlock({ position, sectionId }) {
  const groupRef = useRef()
  const { progress } = useSectionProgress(sectionId)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = progress * Math.PI * 2
      
      // Animate pistons
      const pistons = groupRef.current.children.filter((child) => child.userData.isPiston)
      pistons.forEach((piston, i) => {
        const offset = (i / pistons.length) * Math.PI * 2
        piston.position.y = Math.sin(progress * Math.PI * 4 + offset) * 0.5
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Engine block */}
      <Box args={[2, 1.5, 1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Cylinders */}
      {[...Array(4)].map((_, i) => (
        <group key={i} position={[-0.75 + i * 0.5, 0, 0]}>
          <Cylinder args={[0.2, 0.2, 0.8, 16]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Cylinder
            key={i}
            args={[0.18, 0.18, 0.5, 16]}
            position={[0, 0.9, 0]}
            userData={{ isPiston: true }}
          >
            <meshStandardMaterial color="#ef4444" metalness={0.9} roughness={0.1} />
          </Cylinder>
        </group>
      ))}
    </group>
  )
}

// Planetary gear system
function ScrollPlanetaryGears({ position, sectionId }) {
  const groupRef = useRef()
  const { progress } = useSectionProgress(sectionId)

  useFrame(() => {
    if (groupRef.current) {
      const rotation = progress * Math.PI * 4
      groupRef.current.rotation.z = rotation
      
      // Animate planet gears
      const planets = groupRef.current.children.filter((child) => child.userData.isPlanet)
      planets.forEach((planet, i) => {
        const angle = (Math.PI * 2 * i) / planets.length
        planet.position.x = Math.cos(rotation + angle) * 1.5
        planet.position.y = Math.sin(rotation + angle) * 1.5
        planet.rotation.z = -rotation * 2
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Sun gear */}
      <Torus args={[0.8, 0.2, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.9} roughness={0.1} />
      </Torus>
      
      {/* Planet gears */}
      {[...Array(3)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 3
        return (
          <Torus
            key={i}
            args={[0.4, 0.15, 12, 24]}
            position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            userData={{ isPlanet: true }}
          >
            <meshStandardMaterial color="#8b5cf6" metalness={0.9} roughness={0.1} />
          </Torus>
        )
      })}
    </group>
  )
}

// Geometric sculptures that react to scroll
function ScrollGeometricSculpture({ position, color, sectionId }) {
  const groupRef = useRef()
  const { progress } = useSectionProgress(sectionId)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = progress * Math.PI * 2
      groupRef.current.rotation.y = progress * Math.PI * 1.5
      groupRef.current.rotation.z = progress * Math.PI
      
      const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Icosahedron args={[0.8, 0]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.1}
          wireframe
        />
      </Icosahedron>
      <Octahedron args={[0.6, 0]}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.1}
          opacity={0.5}
          transparent
        />
      </Octahedron>
    </group>
  )
}

// Main enhanced scene
export default function EnhancedScene3D() {
  const scrollProgress = useScrollProgress()

  return (
    <>
      {/* Ambient lighting that changes with scroll */}
      <ambientLight intensity={0.3 + scrollProgress * 0.3} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1 + scrollProgress * 2}
        color="#3b82f6"
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.8 + scrollProgress * 1.5}
        color="#8b5cf6"
      />

      {/* Background gradient sphere */}
      <Sphere args={[50, 32, 32]} position={[0, 0, -50]}>
        <meshStandardMaterial 
          color="#0a0a0a" 
          opacity={0.2 + scrollProgress * 0.3} 
          transparent 
        />
      </Sphere>

      {/* Multiple scroll-reactive spheres */}
      <ScrollFloatingSphere position={[-6, 3, -4]} color="#3b82f6" sectionId="#hero" />
      <ScrollFloatingSphere position={[6, -3, -4]} color="#8b5cf6" sectionId="#about" />
      <ScrollFloatingSphere position={[0, 5, -5]} color="#ec4899" sectionId="#skills" />
      <ScrollFloatingSphere position={[-8, -5, -3]} color="#10b981" sectionId="#projects" />
      <ScrollFloatingSphere position={[8, 2, -4]} color="#f59e0b" sectionId="#contact" />

      {/* Main mechanical assembly - Hero section */}
      <ScrollMechanicalAssembly position={[0, 0, -2]} sectionId="#hero" />

      {/* Robot arm - About section */}
      <ScrollRobotArm position={[-5, -2, -3]} sectionId="#about" />

      {/* Engine block - Skills section */}
      <ScrollEngineBlock position={[5, -1, -3]} sectionId="#skills" />

      {/* Planetary gears - Projects section */}
      <ScrollPlanetaryGears position={[-3, 2, -4]} sectionId="#projects" />

      {/* Additional robot arm */}
      <ScrollRobotArm position={[7, 1, -4]} sectionId="#contact" />

      {/* Geometric sculptures */}
      <ScrollGeometricSculpture position={[3, 3, -4]} color="#3b82f6" sectionId="#skills" />
      <ScrollGeometricSculpture position={[-7, 0, -3]} color="#ec4899" sectionId="#projects" />
      <ScrollGeometricSculpture position={[0, -4, -3]} color="#10b981" sectionId="#contact" />

      {/* Multiple rotating gears */}
      <ScrollReactiveGear position={[-4, -4, -3]} rotationSpeed={0.02} />
      <ScrollReactiveGear position={[4, -4, -3]} rotationSpeed={-0.025} />
      <ScrollReactiveGear position={[-6, 0, -3]} rotationSpeed={0.018} />
      <ScrollReactiveGear position={[6, 0, -3]} rotationSpeed={-0.02} />

      {/* Torus knots with scroll animation */}
      <TorusKnot args={[0.5, 0.2, 64, 16]} position={[0, -3, -3]}>
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.9} 
          roughness={0.1}
        />
      </TorusKnot>

      {/* Additional decorative elements */}
      <Cone args={[0.5, 1, 16]} position={[-2, -5, -3]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
      </Cone>
      <Cone args={[0.5, 1, 16]} position={[2, -5, -3]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
      </Cone>
    </>
  )
}
