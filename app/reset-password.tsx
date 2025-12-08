import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

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
        // Guardar token nuevo
        await SecureStore.setItemAsync('accessToken', data.access_token);
        setSuccess(true);

        // Esperar 2 segundos y redirigir
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
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>✅ ¡Éxito!</Text>
        <Text style={styles.successText}>
          Tu contraseña ha sido restablecida correctamente.
        </Text>
        <Text style={styles.successSubtext}>
          Redirigiendo a inicio...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔐 Restablecer Contraseña</Text>

        <Text style={styles.subtitle}>
          Ingresa tu nueva contraseña. Debe tener:
        </Text>

        <View style={styles.requirementsList}>
          <Text style={styles.requirement}>✓ Mínimo 8 caracteres</Text>
          <Text style={styles.requirement}>✓ Una letra mayúscula</Text>
          <Text style={styles.requirement}>✓ Un número</Text>
          <Text style={styles.requirement}>✓ Un símbolo (!@#$%^&*)</Text>
        </View>

        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Procesando...' : 'Restablecer Contraseña'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  requirementsList: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  requirement: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 15,
  },
  successText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});
