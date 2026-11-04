import { useCallback, useRef, useState } from 'react'
import Experience from './components/Experience'
import { STATIONS } from './data/stations'
import './App.css'

export default function App() {
  const [active, setActive] = useState(0)
  const apiRef = useRef(null) // la escena nos entrega { go(i) } para navegar con los puntos

  // useCallback garantiza que onActive mantenga la misma referencia estable
  // y no provoque re-renders innecesarios en el Canvas de Three.js
  const handleActive = useCallback((i) => {
    setActive(i)
  }, [])

  return (
    <div className="app" style={{ '--c': STATIONS[active].color }}>
      <h1 className="sr-only">Las cuatro capas de una web</h1>

      <Experience onActive={handleActive} apiRef={apiRef} />

      <header className="top">
        <span className="brand">Capas</span>
        <span className="counter" aria-hidden="true">
          {String(active + 1).padStart(2, '0')} / {String(STATIONS.length).padStart(2, '0')}
        </span>
      </header>

      <nav className="dots" aria-label="Secciones">
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Ir a ${s.title}`}
            aria-current={i === active ? 'true' : undefined}
            style={{ '--dot': s.color }}
            onClick={() => apiRef.current?.go(i)}
          />
        ))}
      </nav>
    </div>
  )
}
