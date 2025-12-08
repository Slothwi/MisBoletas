import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleRequest = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://api.misboletas.tech/api/v1/users/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            correo: email,
            contrasena: 'temp'
          })
        }
      );

      if (response.ok) {
        setEnviado(true);
        Alert.alert(
          'Email Enviado',
          'Revisa tu bandeja de entrada. El link expira en 24 horas.'
        );
      } else {
        Alert.alert('Error', 'No se pudo enviar el email. Intenta nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error. Por favor intenta más tarde.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔐 Recuperar Contraseña</Text>

        {!enviado ? (
          <>
            <Text style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un link para restablecer tu contraseña.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRequest}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Link de Recuperación'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backLink}>← Volver al Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Email Enviado</Text>
            <Text style={styles.successText}>
              Hemos enviado un link de recuperación a:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.successText}>
              Revisa tu bandeja de entrada (o spam). El link expira en 24 horas.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Volver al Login</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 30,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    color: '#667eea',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 15,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginVertical: 15,
    textAlign: 'center',
  },
});
