import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { STATIONS } from '../data/stations'

const LAST = STATIONS.length - 1

// El "operador de cámara": convierte el scroll (0..1) en una posición sobre un recorrido.
export default function Rig({ onActive, apiRef }) {
  const scroll = useScroll()
  const size = useThree((s) => s.size)
  const wide = size.width / size.height > 1

  // Dos curvas con la MISMA cantidad de puntos: una para dónde está la cámara y otra para a dónde mira.
  // getPoint(t) pasa exactamente por el punto i cuando t = i / LAST.
  const { camCurve, lookCurve } = useMemo(() => {
    const cam = STATIONS.map((s) => new THREE.Vector3(...s.pos).add(new THREE.Vector3(...s.cam)))
    // Miramos un poco al costado del objeto para que quede libre el lugar del texto.
    // En vertical (celular) lo corremos hacia arriba y el texto va abajo.
    const look = STATIONS.map((s) => {
      const shift = s.side === 'left' ? -2.4 : 2.4
      return new THREE.Vector3(...s.pos).add(new THREE.Vector3(wide ? shift : 0, wide ? 0 : -1.1, 0))
    })
    return { camCurve: new THREE.CatmullRomCurve3(cam), lookCurve: new THREE.CatmullRomCurve3(look) }
  }, [wide])

  const tmp = useMemo(() => ({ p: new THREE.Vector3(), l: new THREE.Vector3() }), [])
  const active = useRef(0)

  // Le damos a la UI de afuera una forma de mover el scroll (los puntos de navegación)
  useEffect(() => {
    apiRef.current = {
      go: (i) => scroll.el.scrollTo({ top: i * scroll.el.clientHeight, behavior: 'smooth' }),
    }
  }, [scroll, apiRef])

  useFrame((state) => {
    const s = scroll.offset * LAST // 0 .. 3: parte entera = estación, decimal = progreso al siguiente tramo
    const i = Math.min(Math.floor(s), LAST - 1)
    // smootherstep frena la cámara al llegar a cada estación (y la acelera entre una y otra)
    const f = THREE.MathUtils.smootherstep(s - i, 0, 1)
    const t = (i + f) / LAST

    camCurve.getPoint(t, tmp.p)
    lookCurve.getPoint(t, tmp.l)
    state.camera.position.copy(tmp.p)
    state.camera.lookAt(tmp.l)

    // setState solo cuando CAMBIA la estación activa, no en cada frame
    const a = Math.round(s)
    if (a !== active.current) {
      active.current = a
      onActive(a)
    }
  })

  return null
}
