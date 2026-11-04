import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import { STATIONS } from '../data/stations'
import { reduceMotion } from '../utils/motion'

// Hace girar lentamente a sus hijos
function Spin({ children, speed = 0.25 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current || reduceMotion) return
    ref.current.rotation.y += delta * speed
    ref.current.rotation.x += delta * speed * 0.5
  })
  return <group ref={ref}>{children}</group>
}

function Structure({ color }) {
  return (
    <Spin>
      <mesh>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color={color} flatShading roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh scale={1.08}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.25} />
      </mesh>
    </Spin>
  )
}

function Movement({ color }) {
  return (
    <Spin speed={0.35}>
      <mesh>
        <torusKnotGeometry args={[0.9, 0.3, 160, 24]} />
        <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.15} clearcoat={1} />
      </mesh>
    </Spin>
  )
}

function Depth({ color }) {
  return (
    <mesh>
      <sphereGeometry args={[1.3, 64, 64]} />
      <MeshDistortMaterial color={color} distort={0.45} speed={reduceMotion ? 0 : 2} roughness={0.2} metalness={0.6} />
    </mesh>
  )
}

function Performance({ color }) {
  const COUNT = 14
  return (
    <Spin speed={0.3}>
      {Array.from({ length: COUNT }, (_, i) => {
        const a = (i / COUNT) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 1.7, Math.sin(a) * 1.7, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.45, 0.2, 0.2]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
          </mesh>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </Spin>
  )
}

const SHAPES = { estructura: Structure, movimiento: Movement, profundidad: Depth, rendimiento: Performance }

export default function World() {
  return (
    <>
      {/* Estrellas lejanas y partículas cercanas: las cercanas dan sensación de velocidad al viajar */}
      <group position={[0, 0, -24]}>
        <Stars radius={90} depth={50} count={1800} factor={4} fade speed={reduceMotion ? 0 : 1} />
      </group>
      <Sparkles count={160} scale={[30, 14, 60]} position={[0, 0, -24]} size={2.5} speed={reduceMotion ? 0 : 0.3} color="#cfd8ff" />

      {STATIONS.map((s) => {
        const Shape = SHAPES[s.id]
        return (
          <group key={s.id} position={s.pos}>
            <Shape color={s.color} />
            {/* una luz del color de la estación tiñe el entorno cercano */}
            <pointLight color={s.color} intensity={30} distance={14} position={[0, 1, 3]} />
          </group>
        )
      })}
    </>
  )
}
