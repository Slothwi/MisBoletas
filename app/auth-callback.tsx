// app/auth-callback.tsx
// Maneja los deep links desde emails de confirmación

import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { authState, checkAuthStatus } = useAuth();

  useEffect(() => {
    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCallback = async () => {
    try {
      const token = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token;
      const type = Array.isArray(searchParams.type) ? searchParams.type[0] : searchParams.type;
      const email = Array.isArray(searchParams.email) ? searchParams.email[0] : searchParams.email;

      console.log('🔗 Deep Link Callback recibido:', { token, type, email });

      if (!token) {
        console.error('❌ Token no proporcionado en deep link');
        router.replace('/bienvenida');
        return;
      }

      // Si es confirmación de email
      if (type === 'signup') {
        console.log('📧 Confirmando email de registro...');
        
        // Aquí Supabase ya validó el token
        // El usuario ya está confirmado en auth
        // Solo necesitamos verificar el estado
        
        // Esperar un momento para que Supabase procese
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar que el usuario está autenticado
        await checkAuthStatus();
        
        console.log('✅ Email confirmado, usuario autenticado');
      } else if (type === 'recovery') {
        console.log('🔑 Link de recuperación de contraseña');
        // Futuro: Implementar reset de contraseña
        router.replace('/(auth)/login');
      }

      // Después de confirmar, redirigir a home
      setTimeout(() => {
        if (authState.isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      }, 1500);

    } catch (error) {
      console.error('❌ Error procesando deep link:', error);
      router.replace('/bienvenida');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a8cbf0' }}>
      <ActivityIndicator size="large" color="#2c3e50" />
      <Text style={{ marginTop: 20, fontSize: 16, color: '#222' }}>
        Confirmando email...
      </Text>
    </View>
  );
}
