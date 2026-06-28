import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { DOMAINS } from '../../lib/data'

const NODE_POSITIONS = [
  [0, 0, 0],       // center hub
  [2.2, 1.2, 0.5],     // D1
  [-2.2, 1.2, -0.5],   // D2
  [1.1, -2.2, 0.5],    // D3
  [-1.1, -2.2, -0.5],  // D4
  [0, 2.7, -1],    // D5
]

function Edge({ from, to, color, opacity = 0.4 }) {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const dir = new THREE.Vector3().subVectors(end, start)
  const length = dir.length()
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  const quaternion = new THREE.Quaternion()
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  )
  return (
    <mesh position={mid.toArray()} quaternion={quaternion.toArray()}>
      <cylinderGeometry args={[0.012, 0.012, length, 6]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function NeuralNetwork({ domainProgress = {} }) {
  const groupRef = useRef()

  const nodes = useMemo(() => {
    return DOMAINS.filter(d => d.weight > 0).slice(0, 5).map((d, i) => {
      const dp = domainProgress[d.id] || { pct: 0 }
      return {
        id: d.id,
        color: d.color || '#ff6b00',
        pos: NODE_POSITIONS[i + 1] || [0, 0, 0],
        pct: dp.pct,
        size: 0.14 + (dp.pct / 100) * 0.24,
      }
    })
  }, [domainProgress])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    
    // Smooth mouse tilt tracking + base rotation
    const targetY = t * 0.12 + state.pointer.x * 0.3
    const targetX = Math.sin(t * 0.08) * 0.06 - state.pointer.y * 0.3
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05)
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 3]} intensity={1.5} color="#ff6b00" />
      <pointLight position={[0, -3, -3]} intensity={0.8} color="#adff00" />

      {/* Hub node */}
      <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={1.0} />
      </Sphere>

      {nodes.map((node) => (
        <group key={node.id}>
          <Edge
            from={NODE_POSITIONS[0]}
            to={node.pos}
            color={node.pct >= 100 ? '#adff00' : node.color}
            opacity={0.35 + node.pct / 200}
          />
          <Sphere args={[node.size, 16, 16]} position={node.pos}>
            <meshStandardMaterial
              color={node.pct >= 100 ? '#adff00' : node.color}
              emissive={node.pct >= 100 ? '#adff00' : node.color}
              emissiveIntensity={0.4 + node.pct / 200}
              transparent
              opacity={0.75 + node.pct / 300}
            />
          </Sphere>
        </group>
      ))}
    </group>
  )
}
