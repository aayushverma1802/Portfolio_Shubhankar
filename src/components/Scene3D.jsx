import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Box, Torus, Cylinder } from '@react-three/drei'

function RotatingGear({ position, rotationSpeed = 0.01 }) {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed
    }
  })

  return (
    <Torus
      ref={meshRef}
      args={[1, 0.3, 16, 100]}
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
    </Torus>
  )
}

function FloatingSphere({ position, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        distort={0.3}
        speed={2}
        roughness={0.5}
        metalness={0.8}
      />
    </Sphere>
  )
}

function MechanicalAssembly({ position }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  const rodPositions = useMemo(() => {
    return [...Array(4)].map((_, i) => {
      const angle = (Math.PI * 2 * i) / 4
      return {
        angle,
        position: [Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8],
        rotation: [0, angle, Math.PI / 2],
      }
    })
  }, [])

  return (
    <group ref={groupRef} position={position}>
      {/* Central cylinder */}
      <Cylinder args={[0.3, 0.3, 2, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* Rotating gears */}
      <RotatingGear position={[0, 1, 0]} rotationSpeed={0.02} />
      <RotatingGear position={[0, -1, 0]} rotationSpeed={-0.02} />
      
      {/* Connecting rods */}
      {rodPositions.map((rod, i) => (
        <Cylinder
          key={i}
          args={[0.05, 0.05, 1, 8]}
          position={rod.position}
          rotation={rod.rotation}
        >
          <meshStandardMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </Cylinder>
      ))}
    </group>
  )
}

export default function Scene3D() {
  return (
    <>
      {/* Background gradient sphere */}
      <Sphere args={[50, 32, 32]} position={[0, 0, -50]}>
        <meshStandardMaterial color="#0a0a0a" opacity={0.3} transparent />
      </Sphere>

      {/* Floating mechanical elements */}
      <FloatingSphere position={[-5, 2, -3]} color="#3b82f6" />
      <FloatingSphere position={[5, -2, -3]} color="#8b5cf6" />
      <FloatingSphere position={[0, 4, -4]} color="#ec4899" />

      {/* Main mechanical assembly */}
      <MechanicalAssembly position={[0, 0, -2]} />

      {/* Additional decorative gears */}
      <RotatingGear position={[-4, 0, -3]} rotationSpeed={0.015} />
      <RotatingGear position={[4, 0, -3]} rotationSpeed={-0.015} />

      {/* Geometric patterns */}
      <Box args={[1, 0.1, 1]} position={[-3, -3, -3]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#3b82f6" opacity={0.6} transparent />
      </Box>
      <Box args={[1, 0.1, 1]} position={[3, -3, -3]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#8b5cf6" opacity={0.6} transparent />
      </Box>
    </>
  )
}
