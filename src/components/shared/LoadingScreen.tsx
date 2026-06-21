'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

function LoadingShape() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial
          color="#0D9488"
          emissive="#0a6b63"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={3}
          metalness={0.8}
          roughness={0.2}
          wireframe={true}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#b45309"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
        />
      </mesh>
      <Sparkles count={40} scale={4} size={2} speed={0.5} color="#0D9488" opacity={0.8} />
    </Float>
  )
}

export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          {/* 3D Canvas */}
          <div className="w-64 h-64 relative mb-8">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} color="#0D9488" />
              <pointLight position={[-10, -10, -10]} intensity={1} color="#F59E0B" />
              <LoadingShape />
            </Canvas>
          </div>

          {/* Loading Text and Progress Bar */}
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-display font-extrabold text-text-primary tracking-tight flex items-center gap-2"
            >
              Launch<span className="text-teal">Pad</span>
              <span className="flex gap-1 ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-teal"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-1 bg-teal rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/30" />
            </motion.div>
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest font-semibold mt-4 animate-pulse">
              Initializing Engine
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
