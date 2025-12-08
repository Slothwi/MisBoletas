import { AppStyles, ThemedText, ThemedView } from '@/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

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
    <ScrollView style={AppStyles.containers.scrollPage}>
      <ThemedView style={[AppStyles.containers.pageContent, { paddingVertical: AppStyles.spacing.xl }]}>
        <ThemedText style={AppStyles.text.detailTitle}>🔐 Recuperar Contraseña</ThemedText>

        {!enviado ? (
          <>
            <ThemedText style={[AppStyles.text.helperText, { marginTop: AppStyles.spacing.lg, marginBottom: AppStyles.spacing.xl, textAlign: 'center' }]}>
              Ingresa tu correo electrónico y te enviaremos un link para restablecer tu contraseña.
            </ThemedText>

            <TextInput
              style={AppStyles.inputs.base}
              placeholder="tu@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={[AppStyles.buttons.primary, { marginTop: AppStyles.spacing.lg }, loading && { opacity: 0.6 }]}
              onPress={handleRequest}
              disabled={loading}
            >
              <ThemedText style={AppStyles.text.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Link de Recuperación'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: AppStyles.spacing.lg }}>
              <ThemedText style={[AppStyles.text.helperText, { textAlign: 'center', color: AppStyles.colors.primary }]}>← Volver al Login</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <View style={AppStyles.containers.centered}>
            <ThemedText style={AppStyles.text.detailTitle}>Email Enviado</ThemedText>
            <ThemedText style={[AppStyles.text.cardText, { marginVertical: AppStyles.spacing.lg, textAlign: 'center' }]}>
              Hemos enviado un link de recuperación a:
            </ThemedText>
            <ThemedText style={[AppStyles.text.label, { marginVertical: AppStyles.spacing.md, backgroundColor: AppStyles.colors.primaryLight, paddingVertical: AppStyles.spacing.md, paddingHorizontal: AppStyles.spacing.lg, borderRadius: 6, textAlign: 'center' }]}>{email}</ThemedText>
            <ThemedText style={[AppStyles.text.helperText, { marginTop: AppStyles.spacing.md, textAlign: 'center' }]}>
              Revisa tu bandeja de entrada (o spam). El link expira en 24 horas.
            </ThemedText>

            <TouchableOpacity
              style={[AppStyles.buttons.primary, { marginTop: AppStyles.spacing.xl }]}
              onPress={() => router.back()}
            >
              <ThemedText style={AppStyles.text.buttonText}>Volver al Login</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}
