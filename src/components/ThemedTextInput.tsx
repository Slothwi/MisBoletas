// ========================================================================
// INICIO: MOVER A /src/components/ThemedTextInput.tsx
//
// NOTA: Una vez movido, el import de './styles' deberá ser actualizado
// para apuntar a la nueva ubicación del sistema de diseño (ej: '../theme').
// ========================================================================

import { useThemeColor } from '@/src/hooks/useThemeColor';
import AppStyles from '@/src/theme';
import React, { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';


export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  placeholderColor?: string;
};

/**
 * ThemedTextInput: TextInput wrapper with theme support.
 * Automatically applies theme colors (text, placeholder, border).
 * 
 * Usage:
 * <ThemedTextInput 
 *   placeholder="Enter name" 
 *   value={name}
 *   onChangeText={setName}
 * />
 */
export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  placeholderColor,
  ...rest
}: ThemedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholderTextColor = useThemeColor(
    { light: placeholderColor, dark: placeholderColor },
    'icon'
  );

  return (
    <TextInput
      style={[
        AppStyles.inputs.base,
        { color: textColor },
        isFocused && AppStyles.inputs.focused,
        style,
      ]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholderTextColor={placeholderTextColor}
      {...rest}
    />
  );
}

// ========================================================================
// FIN: MOVER A /src/components/ThemedTextInput.tsx
// ========================================================================
