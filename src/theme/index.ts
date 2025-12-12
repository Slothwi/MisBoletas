
// ========================================================================
// INICIO: REEMPLAZAR CON import/export en /src/theme/index.ts
// Este objeto `AppStyles` y su exportación default serán reemplazados
// por el contenido del nuevo archivo `index.ts` que exportará todo.
// ========================================================================
import { spacing } from './spacing';
import { colors } from './colors';
import { borderRadius, shadows } from './foundations';
import { containers, misc } from './layout';
import { cards, buttons, inputs, states, pickers } from './components';
import { text } from './typography';

// Exportar cada módulo como named export
export { spacing, colors, borderRadius, shadows, containers, misc, cards, buttons, inputs, states, pickers, text };

// También crear un objeto AppStyles como default export para compatibilidad
const AppStyles = {
  spacing,
  colors,
  borderRadius,
  shadows,
  containers,
  cards,
  buttons,
  text,
  inputs,
  states,
  pickers,
  misc,
};

export default AppStyles;
// ========================================================================
// FIN: REEMPLAZAR CON import/export en /src/theme/index.ts
// ========================================================================