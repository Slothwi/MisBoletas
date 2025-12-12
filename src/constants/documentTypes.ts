/**
 * Constantes de tipos de documentos
 */

export const DOCUMENTO_TIPOS = {
  BOLETA: 'boleta',
  GARANTIA: 'garantia',
  MANUAL: 'manual',
  OTRO: 'otro',
} as const;

export type DocumentoTipo = typeof DOCUMENTO_TIPOS[keyof typeof DOCUMENTO_TIPOS];

/**
 * Descripciones de tipos de documentos para mostrar en UI
 */
export const DOCUMENTO_TIPOS_LABELS: Record<DocumentoTipo, string> = {
  [DOCUMENTO_TIPOS.BOLETA]: 'Boleta de Compra',
  [DOCUMENTO_TIPOS.GARANTIA]: 'Garantía',
  [DOCUMENTO_TIPOS.MANUAL]: 'Manual del Producto',
  [DOCUMENTO_TIPOS.OTRO]: 'Otro Documento',
};
