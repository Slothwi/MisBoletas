import { ThemedText, ThemedView } from '@/src/components';
import { API_ENDPOINTS, BASE_URL, STORAGE_CONFIG } from '@/src/constants/config';
import { useAuth } from '@/src/hooks/useAuth';
import { colors, containers, spacing, text } from '@/src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      console.log('🔐 AuthCallback - Parámetros recibidos:', searchParams);

      // Extraer parámetros (pueden venir como array o string)
      const getParam = (param: any) => {
        return Array.isArray(param) ? param[0] : param;
      };

      const token = getParam(searchParams.token);
      const type = getParam(searchParams.type);
      const email = getParam(searchParams.email);
      const accessToken = getParam(searchParams.access_token);
      const refreshToken = getParam(searchParams.refresh_token);
      const userId = getParam(searchParams.user_id);

      console.log('📤 Parámetros parseados:', { 
        token: !!token, 
        type, 
        email,
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        userId
      });

      // ✅ CASO 1: Deep link desde email con access_token y refresh_token
      // (Venido de Supabase después de verificar email)
      if (accessToken && refreshToken) {
        console.log('✅ CASO 1: Tokens recibidos del email');
        try {
          await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, accessToken);
          if (refreshToken) {
            await AsyncStorage.setItem('refresh_token', refreshToken);
          }
          if (userId) {
            await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify({
              id_usuario: userId,
              email: email || '',
            }));
          }
          console.log('✅ Tokens guardados en AsyncStorage');
          
          // Pequeña pausa para que se guarden
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verificar autenticación
          await checkAuthStatus();
          
          // Redirigir a home
          console.log('➡️ Redirigiendo a home');
          router.replace('/(tabs)');
        } catch (storageError) {
          console.error('❌ Error guardando tokens:', storageError);
          router.replace('/(auth)/login');
        }
        return;
      }

      // ✅ CASO 2: OTP token (de backend verify-otp)
      if (token && email && type === 'signup') {
        console.log('✅ CASO 2: Verificando OTP para signup');
        try {
          const response = await fetch(`${BASE_URL}${API_ENDPOINTS.auth.verifyOTP}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, type: 'signup' }),
          });

          if (!response.ok) {
            console.error('❌ Error en verify-otp:', response.statusText);
            router.replace('/(auth)/login');
            return;
          }

          const authResponse = await response.json();
          console.log('✅ Respuesta verify-otp:', authResponse);
          
          if (authResponse.access_token) {
            try {
              await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, authResponse.access_token);
              if (authResponse.user) {
                await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(authResponse.user));
              }
            } catch (storageError) {
              console.error('❌ Error guardando datos:', storageError);
            }
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          await checkAuthStatus();
          
          setTimeout(() => {
            console.log('➡️ Redirigiendo a home después de signup');
            router.replace('/(tabs)/home');
          }, 1500);
        } catch (error) {
          console.error('❌ Error en verify-otp:', error);
          router.replace('/(auth)/login');
        }
        return;
      }

      // ✅ CASO 3: Recovery (reset password)
      if (type === 'recovery') {
        console.log('✅ CASO 3: Recovery flow');
        // Guardar token temporal para reset-password screen
        if (token) {
          await AsyncStorage.setItem('recovery_token', token);
          await AsyncStorage.setItem('recovery_email', email || '');
        }
        router.replace('/(auth)/reset-password');
        return;
      }

      // ❌ No se detectó ningún caso válido
      console.warn('⚠️ No se detectó un flujo válido. Parámetros:', searchParams);
      router.replace('/bienvenida');

    } catch (error) {
      console.error('❌ Error en handleCallback:', error);
      router.replace('/bienvenida');
    }
  };

  return (
    <ThemedView style={containers.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <ThemedText style={[text.label, { marginTop: spacing.lg }]}>
        Confirmando email...
      </ThemedText>
    </ThemedView>
  );
}