// src/theme/colors.ts

/**
 * PALETA DE COLORES GLOBAL
 * Aquí definimos los tonos base de la aplicación.
 */
export const colors = {
  // Identidad de Marca
  primary: '#e77573',       // Salmón (Botones, Iconos, Acción)
  primaryLight: '#f5f7fa',  // Blanco humo (Fondos de tarjetas en modo claro)
  secondary: '#62A1E4',     // Azul medio (Acentos)
  alert: '#E15351',         // Rojo alerta

  // Fondos
  background: '#a8cbf0',    // Azul Claro (Fondo principal Light)
  backgroundLight: '#fff',  // Blanco puro (Para botones en modo claro)
  backgroundDark: '#0f172a', // Azul Noche (Fondo principal Dark)
  
  // Tarjetas / Superficies
  cardLight: '#f5f7fa',
  cardDark: '#f5f7fa',      // Azul grisáceo oscuro (Para que las tarjetas resalten en modo oscuro)

  // Textos
  textDark: '#222222',      // Texto principal en modo claro
  textLight: '#222222',     // Texto principal en modo oscuro
  textMuted: '#666666',     // Texto secundario (gris)
  textWithed: '#ffffff',   // Texto en fondos oscuros
  
  // Bordes y otros
  border: '#ddd',
  shadow: '#000',
};

// Colores específicos para la navegación (Tabs)
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/**
 * COLORES SEMÁNTICOS (Light vs Dark)
 * Estos son los que usan los componentes ThemedView y ThemedText automáticamente.
 */
export const Colors = {
  light: {
    text: colors.textDark,
    background: colors.background,
    card: colors.cardLight,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: colors.primary,
    placeholder: '#999',
  },
  dark: {
    text: colors.textLight,
    background: colors.backgroundDark,
    card: colors.cardDark,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: colors.primary,
    placeholder: '#aaa',
  },
};