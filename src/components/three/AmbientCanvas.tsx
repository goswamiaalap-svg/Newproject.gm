'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AmbientParticles() {
  const ref = useRef<THREE.Points>(null!)

  const geometry = useMemo(() => {
    const count = 500
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5

      const t = Math.random()
      if (t > 0.6) {
        colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.58; colors[i * 3 + 2] = 0.53 // teal
      } else if (t > 0.3) {
        colors[i * 3] = 0.39; colors[i * 3 + 1] = 0.40; colors[i * 3 + 2] = 0.95 // indigo
      } else {
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.62; colors[i * 3 + 2] = 0.04 // amber
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * 0.006
    ref.current.rotation.y += delta * 0.003
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function AmbientCanvas() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={1}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <AmbientParticles />
      </Canvas>
    </div>
  )
}
