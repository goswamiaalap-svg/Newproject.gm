'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* ── Particle Field ─────────────────────────────────────── */
function ParticleField() {
  const ref = useRef<THREE.Points>(null!)

  const geometry = useMemo(() => {
    const count = 1800
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 28
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14

      if (Math.random() > 0.55) {
        // teal
        colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.58; colors[i * 3 + 2] = 0.53
      } else {
        // amber
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.62; colors[i * 3 + 2] = 0.04
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.018
    ref.current.rotation.x += delta * 0.006
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* ── Central 3D Floating Object ─────────────────────────── */
function CentralObject({
  mouseX,
  mouseY,
}: {
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
}) {
  const outerRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const wireRef  = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.12
      outerRef.current.rotation.x += delta * 0.07
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.2
      innerRef.current.rotation.z += delta * 0.1
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.05
      wireRef.current.rotation.z -= delta * 0.04
    }
    // Smooth mouse parallax on camera
    state.camera.position.x += (mouseX.current * 2   - state.camera.position.x) * 0.04
    state.camera.position.y += (-mouseY.current * 1.5 - state.camera.position.y) * 0.04
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.8}>
      <group>
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.6, 1]} />
          <MeshDistortMaterial
            color="#0D9488"
            emissive="#0a6b63"
            emissiveIntensity={0.5}
            distort={0.35}
            speed={2.5}
            transparent
            opacity={0.85}
            metalness={0.9}
            roughness={0.08}
          />
        </mesh>

        <mesh ref={innerRef}>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#b45309"
            emissiveIntensity={0.6}
            metalness={1}
            roughness={0.05}
            transparent
            opacity={0.75}
          />
        </mesh>

        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.85, 1]} />
          <meshBasicMaterial color="#5EEAD4" wireframe transparent opacity={0.2} />
        </mesh>

        <Sparkles count={60} scale={5} size={0.8} speed={0.4} color="#0D9488" opacity={0.6} />
      </group>
    </Float>
  )
}

/* ── Main Export ────────────────────────────────────────── */
export default function HeroScene({ density }: { density?: 'light' | 'normal' }) {
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const { left, top, width, height } = el.getBoundingClientRect()
    mouseX.current = ((e.clientX - left) / width  - 0.5) * 2
    mouseY.current = ((e.clientY - top)  / height - 0.5) * 2
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseX.current = 0
    mouseY.current = 0
  }, [])

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 0 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]}   intensity={60} color="#0D9488" />
        <pointLight position={[-4, -3, 2]} intensity={40} color="#F59E0B" />
        <pointLight position={[0, 0, 6]}   intensity={25} color="#ffffff" />
        <ParticleField />
        <CentralObject mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  )
}
