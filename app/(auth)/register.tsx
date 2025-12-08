// app/(auth)/register.tsx
import { AppStyles, ThemedText } from '@/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, authState, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (authState.error) {
      Alert.alert('❌ Error', authState.error);
      clearError();
    }
  }, [authState.error, clearError]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      router.replace('/(tabs)');
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const handleRegister = async () => {
    // Validaciones
    if (!formData.nombre || !formData.correo || !formData.contrasena) {
      Alert.alert('❌ Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (formData.contrasena !== formData.confirmPassword) {
      Alert.alert('❌ Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.contrasena.length < 6) {
      Alert.alert('❌ Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validación de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      Alert.alert('❌ Error', 'Por favor ingresa un correo válido');
      return;
    }

    try {
      await register({
        nombre: formData.nombre.trim(),
        correo: formData.correo.toLowerCase().trim(),
        contrasena: formData.contrasena,
      });
      
      // Si llegamos aquí sin token, es que está pendiente confirmación
      if (!authState.token) {
        Alert.alert(
          '✅ ¡Cuenta creada!',
          'Te hemos enviado un email de confirmación. Por favor verifica tu correo y haz click en el link para confirmar tu cuenta.',
          [{ 
            text: 'OK',
            onPress: () => router.replace('/(auth)/login')
          }]
        );
      } else {
        Alert.alert('✅ ¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
      }
    } catch (err: any) {
      console.log('❌ Error en registro:', err.message);
      // El error ya se muestra mediante el useEffect de authState.error
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: AppStyles.colors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: 20 }}>
          <Image 
            source={require('@/assets/images/logoMisBoletas.jpeg')} 
            style={AppStyles.misc.logo} 
          />
          <ThemedText style={[AppStyles.text.detailTitle, { marginBottom: 10 }]}>Crear Cuenta</ThemedText>
          <ThemedText style={[AppStyles.text.cardSubtitle, { textAlign: 'center', marginBottom: 30 }]}>Únete a Mis Boletas</ThemedText>
          
          <View style={{ width: '100%' }}>
            <ThemedText style={AppStyles.text.label}>Nombre *</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Tu nombre completo"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              autoCapitalize="words"
              editable={!authState.isLoading}
            />

            <ThemedText style={AppStyles.text.label}>Correo electrónico *</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="tu@correo.com"
              placeholderTextColor="#999"
              value={formData.correo}
              onChangeText={(text) => setFormData({ ...formData, correo: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!authState.isLoading}
            />

            <ThemedText style={AppStyles.text.label}>Contraseña *</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              value={formData.contrasena}
              onChangeText={(text) => setFormData({ ...formData, contrasena: text })}
              secureTextEntry
              editable={!authState.isLoading}
            />

            <ThemedText style={AppStyles.text.label}>Confirmar Contraseña *</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              editable={!authState.isLoading}
            />

            <TouchableOpacity 
              style={[AppStyles.buttons.primary, authState.isLoading && AppStyles.buttons.disabled]}
              onPress={handleRegister}
              disabled={authState.isLoading}
            >
              <ThemedText style={AppStyles.text.buttonText}>
                {authState.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ marginTop: 15, padding: 10, alignItems: 'center' }}
              onPress={() => router.push('/login')}
              disabled={authState.isLoading}
            >
              <ThemedText style={{ color: '#333', fontSize: 14, fontWeight: '500' }}>¿Ya tienes cuenta? Inicia sesión</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}