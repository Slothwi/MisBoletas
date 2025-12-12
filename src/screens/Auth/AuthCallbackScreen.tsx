import { ThemedText, ThemedView } from '@/src/components';
import { API_ENDPOINTS, BASE_URL, STORAGE_CONFIG } from '@/src/constants/config';
import { useAuth } from '@/src/hooks/useAuth';
// 👇 CORRECCIÓN: Importamos estilos del tema
import { colors, containers, spacing, text } from '@/src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const token = Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token;
      const type = Array.isArray(searchParams.type) ? searchParams.type[0] : searchParams.type;
      const email = Array.isArray(searchParams.email) ? searchParams.email[0] : searchParams.email;
      const accessToken = Array.isArray(searchParams.access_token) ? searchParams.access_token[0] : searchParams.access_token;
      const refreshToken = Array.isArray(searchParams.refresh_token) ? searchParams.refresh_token[0] : searchParams.refresh_token;
      const userId = Array.isArray(searchParams.user_id) ? searchParams.user_id[0] : searchParams.user_id;

      if (accessToken && refreshToken) {
        try {
          await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, accessToken);
          if (refreshToken) await AsyncStorage.setItem('refresh_token', refreshToken);
          if (userId) {
            await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify({
              id_usuario: userId,
              email: email || '',
            }));
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          await checkAuthStatus();
          router.replace('/(tabs)');
        } catch (storageError) {
          router.replace('/(auth)/login');
        }
        return;
      }

      if (!token || !email) {
        router.replace('/bienvenida');
        return;
      }

      if (type === 'signup') {
        const response = await fetch(`${BASE_URL}${API_ENDPOINTS.auth.verifyOTP}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token, type: 'signup' }),
        });

        if (!response.ok) {
          router.replace('/(auth)/login');
          return;
        }

        const authResponse = await response.json();
        
        if (authResponse.access_token) {
          try {
            await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, authResponse.access_token);
            if (authResponse.user) {
              await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(authResponse.user));
            }
          } catch (storageError) {
            console.error(storageError);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkAuthStatus();
        
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
      } else if (type === 'recovery') {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(auth)/login');
      }

    } catch (error) {
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