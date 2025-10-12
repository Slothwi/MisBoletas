import { useColorScheme } from '@/src/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            title: 'Login'
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="bienvenida" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="nosotros" 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}