import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { View, Text } from 'react-native';

export default function Index() {
  const { authState } = useAuth();

  // Mostrar loading mientras se verifica el estado de autenticación
  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a8cbf0' }}>
        <Text style={{ fontSize: 18, color: '#222' }}>Cargando...</Text>
      </View>
    );
  }

  // Si está autenticado, ir directamente a los productos (home)
  if (authState.isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Si no está autenticado, ir a bienvenida
  return <Redirect href="/bienvenida" />;
}