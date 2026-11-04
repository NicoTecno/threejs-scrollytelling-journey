// Se evalúa una vez al cargar. Para reaccionar a cambios en vivo habría que escuchar el evento "change".
export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
