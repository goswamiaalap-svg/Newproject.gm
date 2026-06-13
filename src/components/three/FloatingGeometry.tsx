'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingShape({
  geometry,
  position,
  rotationSpeed,
  color = '#0D9488',
}: {
  geometry: 'icosahedron' | 'torus' | 'octahedron'
  position: [number, number, number]
  rotationSpeed: [number, number, number]
  color?: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0]
      meshRef.current.rotation.y += rotationSpeed[1]
      meshRef.current.rotation.z += rotationSpeed[2]
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry === 'icosahedron' && <icosahedronGeometry args={[1.8, 1]} />}
      {geometry === 'torus' && <torusGeometry args={[1.5, 0.4, 16, 32]} />}
      {geometry === 'octahedron' && <octahedronGeometry args={[1.4, 0]} />}
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  )
}

export default function FloatingGeometry() {
  return (
    <group>
      <FloatingShape
        geometry="icosahedron"
        position={[-5, 2, -3]}
        rotationSpeed={[0.001, 0.002, 0.001]}
        color="#0D9488"
      />
      <FloatingShape
        geometry="torus"
        position={[5, -1, -4]}
        rotationSpeed={[0.002, 0.001, 0.0015]}
        color="#0D9488"
      />
      <FloatingShape
        geometry="octahedron"
        position={[0, -3, -2]}
        rotationSpeed={[0.0015, 0.001, 0.002]}
        color="#6366F1"
      />
    </group>
  )
}
