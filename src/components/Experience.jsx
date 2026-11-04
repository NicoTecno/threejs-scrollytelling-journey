import { memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, Scroll, ScrollControls } from '@react-three/drei'
import Rig from './Rig'
import World from './World'
import Sections from './Sections'
import { STATIONS } from '../data/stations'

function Experience({ onActive, apiRef }) {
  return (
    <Canvas camera={{ position: [0, 0.4, 6], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#0b1020']} />
      {/* La niebla funde con el fondo lo que está lejos: da profundidad y esconde lo que aún no llegaste a ver */}
      <fog attach="fog" args={['#0b1020', 10, 45]} />

      <ambientLight intensity={0.25} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -5]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>

      {/* pages = cuántas pantallas de alto tiene el scroll: una por estación */}
      <ScrollControls pages={STATIONS.length} damping={0.3}>
        <Rig onActive={onActive} apiRef={apiRef} />
        <World />
        <Scroll html style={{ width: '100%' }}>
          <Sections />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}

// memo evita que el Canvas se reconstruya cuando el estado `active` cambia en App.jsx
export default memo(Experience)
