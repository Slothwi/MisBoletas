import { ThemedText, ThemedView } from '@/src/components';
// 👇 CORRECCIÓN: Importamos estilos del tema
import { buttons, cards, containers, inputs, spacing, text } from '@/src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir una mayúscula';
    if (!/[0-9]/.test(pwd)) return 'Debe incluir un número';
    if (!/[!@#$%^&*]/.test(pwd)) return 'Debe incluir un símbolo (!@#$%^&*)';
    return null;
  };

  const handleReset = async () => {
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
      const response = await fetch(
        'https://api.misboletas.tech/api/v1/users/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: token,
            password: password
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem('accessToken', data.access_token);
        setSuccess(true);
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 2000);
      } else {
        Alert.alert(
          'Error',
          data.detail || 'El link ha expirado. Solicita uno nuevo.'
        );
      }
    } catch (error) {
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
          <ThemedText style={text.helperText}>✓ Mínimo 6 caracteres</ThemedText>
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