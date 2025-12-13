import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import React from 'react';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'card'; // Agregamos variante para tarjetas
};

export function ThemedView({ style, lightColor, darkColor, variant = 'default', ...otherProps }: ThemedViewProps) {
  // Si es variante 'card', usa el color de tarjeta, si no, el de fondo
  const colorName = variant === 'card' ? 'card' : 'background';
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}