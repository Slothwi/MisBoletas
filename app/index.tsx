import { AppStyles, ThemedText, ThemedView } from '@/components';
import { useAuth } from '@/src/hooks/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { authState } = useAuth();

  // Mostrar loading mientras se verifica el estado de autenticación
  if (authState.isLoading) {
    return (
      <ThemedView style={AppStyles.containers.centered}>
        <ThemedText style={AppStyles.text.label}>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  // Si está autenticado, ir directamente a los productos (home)
  if (authState.isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Si no está autenticado, ir a bienvenida
  return <Redirect href="/bienvenida" />;
}