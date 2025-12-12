/**
 * Logger centralizado para la aplicación
 * En producción, solo muestra errores
 * En desarrollo, muestra todos los logs
 */

const isDev = __DEV__;

export const logger = {
  /**
   * Log informativo (solo en desarrollo)
   */
  log: (tag: string, message: any) => {
    if (isDev) {
      console.log(`[${tag}]`, message);
    }
  },

  /**
   * Advertencias (solo en desarrollo)
   */
  warn: (tag: string, message: any) => {
    if (isDev) {
      console.warn(`[${tag}]`, message);
    }
  },

  /**
   * Errores (SIEMPRE se muestran, incluso en producción)
   */
  error: (tag: string, error: any) => {
    console.error(`[${tag}]`, error);
  },

  /**
   * Debug con condicional (para valores que solo necesitas ver en dev)
   */
  debug: (tag: string, data: any) => {
    if (isDev) {
      console.log(`[DEBUG: ${tag}]`, data);
    }
  },
};
