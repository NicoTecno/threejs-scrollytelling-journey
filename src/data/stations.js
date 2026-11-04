// Cada estación es un lugar del viaje: dónde está en el espacio, dónde se para la cámara
// (cam, relativo a pos) y de qué lado va el texto. Para cambiar el contenido, tocá solo este archivo.
export const STATIONS = [
  {
    id: 'estructura', n: '01', title: 'Estructura', color: '#ff7a59', side: 'left',
    text: 'HTML semántico, CSS que escala y accesibilidad desde el primer commit. Lo que no se ve es lo que sostiene todo lo demás.',
    pos: [0, 0, 0], cam: [0, 0.4, 6],
  },
  {
    id: 'movimiento', n: '02', title: 'Movimiento', color: '#5b8cff', side: 'right',
    text: 'Animaciones con propósito: guían la atención, confirman acciones y respetan a quien pidió menos movimiento.',
    pos: [7, 2, -16], cam: [2, 0.5, 6],
  },
  {
    id: 'profundidad', n: '03', title: 'Profundidad', color: '#7be0c3', side: 'left',
    text: '3D, shaders y capas cuando suman. Un objeto bien iluminado dice más que diez efectos mal elegidos.',
    pos: [-7, -1.5, -32], cam: [-2, 0.2, 6],
  },
  {
    id: 'rendimiento', n: '04', title: 'Rendimiento', color: '#ffd166', side: 'right',
    text: 'Peso de los archivos, cuadros por segundo y carga diferida. Una web premium no puede sentirse lenta.',
    pos: [0, 1.5, -48], cam: [0, 0.5, 6.5],
  },
]
