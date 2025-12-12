// ========================================================================
// INICIO: MOVER A /src/theme/colors.ts
//
// NOTA: Este contenido debe ser movido y posiblemente combinado con
// el objeto `colors` que se encuentra actualmente en `components/styles.ts`.
// El nuevo archivo `src/theme/colors.ts` centralizará TODOS los colores de la app.
// ========================================================================

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

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

// ========================================================================
// FIN: MOVER A /src/theme/colors.ts
// ========================================================================
