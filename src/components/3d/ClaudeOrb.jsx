import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

function InnerGlow() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    // Elegant pulsing emissive intensity
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
    ref.current.material.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4
  })
  return (
    <Sphere ref={ref} args={[0.55, 32, 32]}>
      <meshStandardMaterial
        color="#ff6b00"
        emissive="#ff6b00"
        emissiveIntensity={0.8}
        transparent
        opacity={0.25}
        side={THREE.BackSide}
      />
    </Sphere>
  )
}

function WireOrb() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    // Constant multi-axis rotation
    ref.current.rotation.x = t * 0.35
    ref.current.rotation.y = t * 0.5
    ref.current.rotation.z = t * 0.15
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.85, 2]} />
      <meshStandardMaterial
        color="#ff6b00"
        emissive="#ff6b00"
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function OuterRing() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.PI / 2 + t * 0.25
    ref.current.rotation.z = t * 0.12
  })
  return (
    <Torus ref={ref} args={[1.2, 0.015, 16, 120]}>
      <meshStandardMaterial
        color="#adff00"
        emissive="#adff00"
        emissiveIntensity={0.9}
        transparent
        opacity={0.7}
      />
    </Torus>
  )
}

function OuterRing2() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = Math.PI / 3 + t * 0.18
    ref.current.rotation.x = t * 0.1
  })
  return (
    <Torus ref={ref} args={[1.45, 0.008, 16, 120]}>
      <meshStandardMaterial
        color="#ff6b00"
        emissive="#adff00"
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
      />
    </Torus>
  )
}

export default function ClaudeOrb({ scale = 1 }) {
  const groupRef = useRef()

  // Track pointer for interactive tilt effect
  useFrame((state) => {
    if (!groupRef.current) return
    const targetX = state.pointer.x * 0.4
    const targetY = state.pointer.y * 0.4
    
    // Smooth interpolation (lerp) toward target position
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.1)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1)
  })

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef} scale={scale}>
        {/* Futuristic lighting layout */}
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={2.0} color="#ff6b00" />
        <pointLight position={[-2, -1, -2]} intensity={1.2} color="#adff00" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#ff6b00" />

        {/* Mesh layers */}
        <InnerGlow />
        <WireOrb />
        <OuterRing />
        <OuterRing2 />
      </group>
    </Float>
  )
}
