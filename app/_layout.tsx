import { AuthProvider } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { colors } from '@/src/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="index" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="bienvenida" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="formulario" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="auth-callback" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="(auth)" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ title: 'Página no encontrada' }}
          />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Toast 
          config={{
            success: (props) => (
              <BaseToast
                {...props}
                style={{ backgroundColor: '#10B981', borderLeftColor: '#10B981' }}
                text1Style={{ color: '#fff', fontWeight: '600' }}
              />
            ),
            error: (props) => (
              <ErrorToast
                {...props}
                style={{ backgroundColor: '#EF4444', borderLeftColor: '#EF4444' }}
                text1Style={{ color: '#fff', fontWeight: '600' }}
              />
            ),
            info: (props) => (
              <BaseToast
                {...props}
                style={{ backgroundColor: colors.primary, borderLeftColor: colors.primary }}
                text1Style={{ color: '#fff', fontWeight: '600' }}
              />
            ),
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}