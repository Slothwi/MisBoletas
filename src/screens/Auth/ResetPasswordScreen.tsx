import { ThemedText, ThemedView } from '@/src/components';
import { buttons, cards, containers, inputs, spacing, text } from '@/src/theme';
import { API_ENDPOINTS, BASE_URL, STORAGE_CONFIG } from '@/src/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cargar token y email del AsyncStorage (guardados por AuthCallbackScreen)
  useEffect(() => {
    loadRecoveryData();
  }, []);

  const loadRecoveryData = async () => {
    try {
      const token = await AsyncStorage.getItem('recovery_token');
      const email = await AsyncStorage.getItem('recovery_email');
      
      if (!token || !email) {
        Alert.alert('Error', 'Link expirado o inválido. Solicita otro reset de contraseña.');
        router.replace('/(auth)/login');
        return;
      }
      
      setRecoveryToken(token);
      setRecoveryEmail(email);
    } catch (error) {
      console.error('Error loading recovery data:', error);
      router.replace('/(auth)/login');
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir una mayúscula';
    if (!/[0-9]/.test(pwd)) return 'Debe incluir un número';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Debe incluir un símbolo (!@#$%^&*)';
    return null;
  };

  const handleReset = async () => {
    if (!recoveryToken || !recoveryEmail) {
      Alert.alert('Error', 'Datos de recuperación inválidos');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Contraseña débil', passwordError);
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Resetting password for:', recoveryEmail);
      
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.auth.resetPassword || '/auth/reset-password'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: recoveryToken,
            email: recoveryEmail,
            password: password
          })
        }
      );

      const data = await response.json();
      console.log('✅ Reset response:', response.status);

      if (response.ok) {
        // Guardar token si viene en la respuesta
        if (data.access_token) {
          await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, data.access_token);
          if (data.user) {
            await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(data.user));
          }
        }

        // Guardar token si viene en la respuesta
        if (data.access_token) {
          await AsyncStorage.setItem(STORAGE_CONFIG.authTokenKey, data.access_token);
          if (data.user) {
            await AsyncStorage.setItem(STORAGE_CONFIG.userDataKey, JSON.stringify(data.user));
          }
        }

        // Limpiar datos temporales
        await AsyncStorage.removeItem('recovery_token');
        await AsyncStorage.removeItem('recovery_email');

        setSuccess(true);
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 2000);
      } else {
        Alert.alert(
          'Error',
          data.detail || 'El link ha expirado. Solicita uno nuevo.'
        );
        
        // Limpiar si el token expiró
        if (response.status === 401 || response.status === 400) {
          await AsyncStorage.removeItem('recovery_token');
          await AsyncStorage.removeItem('recovery_email');
          router.replace('/(auth)/forgot-password');
        }
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      Alert.alert('Error', 'No se pudo restablecer la contraseña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ThemedView style={containers.centered}>
        <ThemedText style={[text.detailTitle, { color: '#28a745' }]}>✅ ¡Éxito!</ThemedText>
        <ThemedText style={[text.cardText, { marginTop: spacing.md }]}>
          Tu contraseña ha sido restablecida correctamente.
        </ThemedText>
        <ThemedText style={[text.helperText, { marginTop: spacing.md }]}>
          Redirigiendo a inicio...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={containers.scrollPage}>
      <ThemedView style={[containers.pageContent, { paddingVertical: spacing.xl }]}>
        <ThemedText style={text.detailTitle}>🔐 Restablecer Contraseña</ThemedText>

        <ThemedText style={[text.helperText, { marginTop: spacing.lg }]}>
          Ingresa tu nueva contraseña. Debe tener:
        </ThemedText>

        <ThemedView style={[cards.base, { marginTop: spacing.lg, marginBottom: spacing.lg }]}>
          <ThemedText style={text.helperText}>✓ Mínimo 8 caracteres</ThemedText>
          <ThemedText style={text.helperText}>✓ Una mayúscula (A-Z)</ThemedText>
          <ThemedText style={text.helperText}>✓ Un número (0-9)</ThemedText>
          <ThemedText style={text.helperText}>✓ Un símbolo (!@#$%^&*)</ThemedText>
        </ThemedView>

        <ThemedText style={text.label}>Nueva Contraseña</ThemedText>
        <TextInput
          style={inputs.base}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          placeholderTextColor="#999"
        />

        <ThemedText style={[text.label, { marginTop: spacing.lg }]}>Confirmar Contraseña</ThemedText>
        <TextInput
          style={inputs.base}
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[buttons.primary, { marginTop: spacing.lg }, loading && { opacity: 0.6 }]}
          onPress={handleReset}
          disabled={loading}
        >
          <ThemedText style={text.buttonText}>
            {loading ? 'Procesando...' : 'Restablecer Contraseña'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}