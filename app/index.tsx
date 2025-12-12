import { ThemedText, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { containers, text } from '@/src/theme';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <ThemedView style={containers.centered}>
        <ThemedText style={text.label}>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  if (authState.isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/bienvenida" />;
}