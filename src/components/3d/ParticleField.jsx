import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = [
  '#ff6b00', // cyber orange
  '#adff00', // cyber lime
  '#cbd5e1', // slate white
  '#475569', // dim slate
]

export default function ParticleField({ count = 1500 }) {
  const mesh = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorObjs = COLORS.map(c => new THREE.Color(c))

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 32
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20

      const c = colorObjs[Math.floor(Math.random() * colorObjs.length)]
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime() * 0.02
    
    // Smooth mouse-reactive rotation shift
    const targetY = t + state.pointer.x * 0.25
    const targetX = t * 0.3 - state.pointer.y * 0.25
    
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetY, 0.05)
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetX, 0.05)
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
    </>
  )
}
