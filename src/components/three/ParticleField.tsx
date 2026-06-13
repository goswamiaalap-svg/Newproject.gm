'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  connectionDistance?: number
  mouseParallax?: boolean
  density?: 'full' | 'light'
}

function Particles({
  count = 200,
  connectionDistance = 2.5,
  mouseParallax = true,
}: Omit<ParticleFieldProps, 'density'>) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const groupRef = useRef<THREE.Group>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const { size } = useThree()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count * 3)

    const tealColor = new THREE.Color('#0D9488')
    const indigoColor = new THREE.Color('#6366F1')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      speeds[i3] = (Math.random() - 0.5) * 0.01
      speeds[i3 + 1] = (Math.random() - 0.5) * 0.01
      speeds[i3 + 2] = (Math.random() - 0.5) * 0.005

      const color = Math.random() > 0.5 ? tealColor : indigoColor
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors, speeds }
  }, [count])

  const lineGeometry = useMemo(() => {
    const maxConnections = count * 10
    const positions = new Float32Array(maxConnections * 6)
    const colors = new Float32Array(maxConnections * 6)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setDrawRange(0, 0)
    return geometry
  }, [count])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / size.width - 0.5) * 2
      mousePos.current.y = -(e.clientY / size.height - 0.5) * 2
    },
    [size]
  )

  useMemo(() => {
    if (mouseParallax && typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseParallax, handleMouseMove])

  useFrame((state) => {
    if (!pointsRef.current) return
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] += particles.speeds[i3]
      positions[i3 + 1] += particles.speeds[i3 + 1]
      positions[i3 + 2] += particles.speeds[i3 + 2]

      if (Math.abs(positions[i3]) > 10) particles.speeds[i3] *= -1
      if (Math.abs(positions[i3 + 1]) > 10) particles.speeds[i3 + 1] *= -1
      if (Math.abs(positions[i3 + 2]) > 5) particles.speeds[i3 + 2] *= -1
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Update connections
    if (linesRef.current) {
      const linePositions = lineGeometry.attributes.position
        .array as Float32Array
      const lineColors = lineGeometry.attributes.color.array as Float32Array
      let lineIndex = 0

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const i3 = i * 3
          const j3 = j * 3
          const dx = positions[i3] - positions[j3]
          const dy = positions[i3 + 1] - positions[j3 + 1]
          const dz = positions[i3 + 2] - positions[j3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < connectionDistance && lineIndex < count * 10) {
            const li = lineIndex * 6
            linePositions[li] = positions[i3]
            linePositions[li + 1] = positions[i3 + 1]
            linePositions[li + 2] = positions[i3 + 2]
            linePositions[li + 3] = positions[j3]
            linePositions[li + 4] = positions[j3 + 1]
            linePositions[li + 5] = positions[j3 + 2]

            const alpha = 1 - dist / connectionDistance
            lineColors[li] = 0.05 * alpha
            lineColors[li + 1] = 0.58 * alpha
            lineColors[li + 2] = 0.53 * alpha
            lineColors[li + 3] = 0.05 * alpha
            lineColors[li + 4] = 0.58 * alpha
            lineColors[li + 5] = 0.53 * alpha

            lineIndex++
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex * 2)
      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true
    }

    // Mouse parallax
    if (mouseParallax && groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.current.x * 0.1,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.current.y * 0.1,
        0.05
      )
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.3} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

export default function ParticleField({
  count = 200,
  connectionDistance = 2.5,
  mouseParallax = true,
  density = 'full',
}: ParticleFieldProps) {
  const particleCount = density === 'light' ? Math.floor(count * 0.4) : count

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={['#0D1321', 8, 20]} />
      <Particles
        count={particleCount}
        connectionDistance={connectionDistance}
        mouseParallax={mouseParallax}
      />
    </Canvas>
  )
}
