// src/theme/colors.ts

// Paleta de colores principal de la aplicación
export const colors = {
  primary: '#e77573',
  primaryLight: '#f5f7fa',
  background: '#a8cbf0',
  backgroundLight: '#fff',
  textDark: '#222',
  textMuted: '#666',
  textLight: '#fff',
  border: '#ddd',
  shadow: '#000',
  secondary: '#62A1E4',
  alert: '#E15351'
};

// Colores para el sistema de temas (Light/Dark mode)
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};