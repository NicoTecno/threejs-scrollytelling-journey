# Proyecto 5 — Viaje 3D Guiado por el Scroll: Las Cuatro Capas

Una experiencia inmersiva en Three.js / React Three Fiber donde el scroll del usuario controla la cámara a lo largo de un recorrido curvo tridimensional, visitando cuatro "estaciones" espaciales que representan las cuatro capas de la web moderna: **Estructura**, **Movimiento**, **Profundidad** y **Rendimiento**.

---

## 🚀 Conceptos Clave y Decisiones Técnicas

### 1. El Scroll como Dato (`ScrollControls` + `useScroll`)
En lugar de animar elementos con librerías tradicionales de scroll en el DOM, se utiliza `ScrollControls` de `@react-three/drei`. Este componente crea un contenedor virtual con scroll nativo y expone `useScroll().offset`, un número normalizado de `0.0` a `1.0`. Todo el sistema se reduce a:
> **Input:** `scroll.offset` (0 a 1)  
> **Output:** Posición y orientación de la cámara calculadas en tiempo real.

### 2. Recorrido Curvo con `CatmullRomCurve3`
En `Rig.jsx` se definen dos curvas suaves interpoladas:
1. **Curva de posición de cámara (`camCurve`)**: Calcula hacia dónde debe desplazarse el punto de vista.
2. **Curva de enfoque (`lookCurve`)**: Calcula el punto exacto hacia el cual apunta la cámara (`camera.lookAt`).

Cada estación $i$ en `data/stations.js` coincide exactamente con $t = \frac{i}{N-1}$ sobre la curva. Agregar nuevas paradas al viaje solo requiere sumar un nuevo objeto con coordenadas en `stations.js`.

### 3. Frenado Suave con `smootherstep`
Si la cámara avanzara de forma lineal con el scroll, nunca se detendría con naturalidad frente a los objetos. Aplicando `THREE.MathUtils.smootherstep` a la parte fraccional de cada tramo:
```js
const s = scroll.offset * LAST
const i = Math.min(Math.floor(s), LAST - 1)
const f = THREE.MathUtils.smootherstep(s - i, 0, 1)
const t = (i + f) / LAST
```
La cámara acelera suavemente entre estaciones y desacelera al aproximarse a cada destino, produciendo una sensación táctil de "llegada".

### 4. Texto HTML Sincronizado y Accesible (`<Scroll html>`)
El contenido textual vive dentro de `<Scroll html>` como elementos HTML semánticos (`<section>`, `<h2>`, `<p>`).
- Cada panel tiene una altura de `100vh`.
- Al estar sincronizado con las páginas del scroll (`pages = STATIONS.length`), el panel $i$ queda centrado exactamente cuando la cámara se detiene en la estación $i$.
- **Ventaja de accesibilidad:** El texto es seleccionable, indexable por motores de búsqueda y completamente legible por lectores de pantalla (screen readers).

### 5. Encuadre Adaptativo y Mobile
- **Desktop (pantalla horizontal):** La cámara enfoca con un desplazamiento lateral (`shift = ±2.4`) para dejar libre el espacio donde se proyecta la tarjeta de texto.
- **Mobile (pantalla vertical):** La cámara se ajusta para colocar el objeto 3D en la mitad superior y el texto en la mitad inferior, respaldado por un panel con efecto *glassmorphism* (`backdrop-filter: blur(8px)`) que garantiza legibilidad óptima.

### 6. Transición Dinámica de Fondo y Niebla (`SceneEffects`)
El color de fondo (`scene.background`) y la niebla volumétrica (`scene.fog`) interpolan suavemente sus tonos hacia el color temático de la estación activa, aumentando la sensación de atmósfera y continuidad en el espacio.

### 7. Optimización de Rendimiento y Chunks
- **DPR Controlado:** `dpr={[1, 1.5]}` para mantener fluidez y evitar sobrecargar pantallas de ultra alta resolución (Retina/4K).
- **Code Splitting:** En `vite.config.js`, las dependencias pesadas (`three` y `@react-three/*`) se separan en chunks dedicados independientes del bundle de la aplicación.
- **Lazy Loading:** El componente `<Experience />` se carga de forma diferida (`React.lazy`), mostrando la interfaz y el indicador de carga inmediatamente sin bloquear el hilo principal.

---

## 🛠️ Comandos de Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 📁 Estructura del Proyecto

```
viaje/
├── index.html
├── vite.config.js          # Configuración de Vite con chunks y límites optimizados
├── package.json
└── src/
    ├── main.jsx            # Punto de entrada de React con StrictMode
    ├── App.jsx             # UI superpuesta, contador, nombre de estación y botones
    ├── App.css             # Estilos de layout, tipografía Sora y responsive queries
    ├── index.css           # Hoja base limpia
    ├── data/
    │   └── stations.js     # Datos de estaciones (títulos, descripciones, colores, coordenadas)
    ├── components/
    │   ├── Experience.jsx  # Canvas Three.js, iluminación, niebla dinámica y ScrollControls
    │   ├── Rig.jsx         # Operador de cámara: CatmullRomCurve3 + smootherstep
    │   ├── World.jsx       # Geometrías 3D de cada estación, estrellas y partículas Sparkles
    │   └── Sections.jsx    # Paneles de contenido HTML sincronizados
    └── utils/
        └── motion.js       # Detección reactiva de prefers-reduced-motion
```

