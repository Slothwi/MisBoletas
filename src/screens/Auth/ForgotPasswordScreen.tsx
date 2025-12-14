import { ThemedText } from '@/src/components';
import { buttons, colors, containers, inputs, misc, spacing, text } from '@/src/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const API_URL = 'https://api.misboletas.tech/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleRequest = async () => {
    if (!email) { 
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ingresa tu correo',
      });
      return; 
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v1/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEnviado(true);
        Toast.show({
          type: 'success',
          text1: '¡Éxito!',
          text2: 'Revisa tu correo para restablecer tu contraseña',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.detail || 'No se pudo procesar tu solicitud',
        });
      }
    } catch (error) {
      console.error('[FORGOT-PASSWORD] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error de conexión',
        text2: 'Verifica tu conexión e intenta nuevamente',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={containers.scrollPage} contentContainerStyle={containers.scrollPageContent}>
      {/* Botón Volver */}
      <TouchableOpacity onPress={() => router.back()} style={[misc.backButton, { alignSelf: 'flex-start', marginTop: 16 }]}>
        <ThemedText style={misc.backButtonText}>Volver</ThemedText>
      </TouchableOpacity>

      <View style={{ width: '100%', alignItems: 'center', marginTop: spacing.xl }}>
        <ThemedText style={text.detailTitle}>Recuperar Contraseña</ThemedText>
        
        {!enviado ? (
          <View style={{ width: '100%', marginTop: spacing.lg }}>
            <ThemedText style={[text.cardSubtitle, { textAlign: 'left', marginBottom: spacing.xl }]}>
              Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones.
            </ThemedText>

            <ThemedText style={text.label}>Correo electrónico</ThemedText>
            <TextInput
              style={inputs.base}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />

            <TouchableOpacity
              style={[buttons.primary, { marginTop: spacing.xl }]}
              onPress={handleRequest}
              disabled={loading}
            >
              <ThemedText style={text.buttonText}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: '100%', alignItems: 'center', marginTop: spacing.lg }}>
            <View style={{ backgroundColor: '#e8f5e9', padding: spacing.lg, borderRadius: 100, marginBottom: spacing.lg }}>
              <ThemedText style={{ fontSize: 40 }}>✉️</ThemedText>
            </View>
            <ThemedText style={[text.cardTitle, { marginBottom: spacing.sm }]}>¡Correo enviado!</ThemedText>
            <ThemedText style={[text.cardSubtitle, { textAlign: 'center', marginBottom: spacing.xl }]}>
              Revisa tu bandeja de entrada en {email}
            </ThemedText>
            <TouchableOpacity style={buttons.secondary} onPress={() => router.replace('/(auth)/login')}>
              <ThemedText style={[text.buttonTextColorless, { color: colors.primary }]}>Volver al Login</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}