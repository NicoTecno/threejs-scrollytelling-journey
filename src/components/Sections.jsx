import { STATIONS } from '../data/stations'

// Estos paneles son HTML real (seleccionable, legible por lectores de pantalla).
// Cada uno mide 100vh: como la cámara se detiene en la estación i cuando scrollTop = i * 100vh,
// el panel i queda justo en pantalla cuando la cámara llega.
export default function Sections() {
  return STATIONS.map((s) => (
    <section key={s.id} className={`panel ${s.side}`} style={{ '--c': s.color }}>
      <div className="card">
        <span className="num">{s.n}</span>
        <h2>{s.title}</h2>
        <p>{s.text}</p>
      </div>
    </section>
  ))
}
