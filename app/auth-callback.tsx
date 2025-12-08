// app/auth-callback.tsx
// Maneja los deep links desde emails de confirmación

import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/src/hooks/useAuth';
import { API_ENDPOINTS, BASE_URL, STORAGE_CONFIG } from '@/src/constants/config';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { checkAuthStatus } = useAuth();

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

      if (!token || !email) {
        console.error('❌ Token o email no proporcionado en deep link');
        router.replace('/bienvenida');
        return;
      }

      // Si es confirmación de email (signup)
      if (type === 'signup') {
        console.log('📧 Email ya verificado por el puente. Procesando...');
        
        // El backend ya verificó el OTP en /confirm
        // Solo necesitamos guardar el token y autenticar
        // Hacer un pequeño llamado al backend para obtener la sesión
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.auth.verifyOTP}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            token: token,
            type: 'signup',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Error verificando OTP:', errorData.detail || 'Unknown error');
          router.replace('/(auth)/login');
          return;
        }

        const authResponse = await response.json();
        console.log('✅ Email confirmado y usuario autenticado');
        
        // Guardar el token en AsyncStorage
        if (authResponse.access_token) {
          try {
            await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, authResponse.access_token);
            if (authResponse.user) {
              await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(authResponse.user));
            }
            console.log('💾 Token y usuario guardados en AsyncStorage');
          } catch (storageError) {
            console.error('❌ Error guardando datos:', storageError);
          }
        }

        // Verificar estado de autenticación
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkAuthStatus();
        
        // Redirigir a home
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
      } else if (type === 'recovery') {
        console.log('🔑 Link de recuperación de contraseña');
        // Futuro: Implementar reset de contraseña
        router.replace('/(auth)/login');
      } else {
        console.warn('⚠️ Tipo de OTP no soportado:', type);
        router.replace('/(auth)/login');
      }

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
