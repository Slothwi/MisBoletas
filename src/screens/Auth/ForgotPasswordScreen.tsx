import { ThemedText } from '@/src/components';
import { buttons, colors, containers, inputs, misc, spacing, text } from '@/src/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleRequest = async () => {
    if (!email) { Alert.alert('Error', 'Ingresa tu correo'); return; }
    setLoading(true);
    // Simulación de éxito para UI (conecta tu API aquí)
    setTimeout(() => { setLoading(false); setEnviado(true); }, 1500);
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