import { ThemedText } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
// 👇 CORRECCIÓN: Importamos estilos del tema
import { buttons, colors, inputs, misc, text } from '@/src/theme';
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

  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      router.replace('/(tabs)');
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const handleRegister = async () => {
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
      
      if (!authState.token) {
        Alert.alert(
          '✅ ¡Cuenta creada!',
          'Te hemos enviado un email de confirmación.',
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
    }
  };

  return (
    <KeyboardAvoidingView 
        style={{ flex: 1, backgroundColor: colors.background }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        >
        <View style={{ padding: 20 }}>
            <Image 
            source={require('@/assets/images/logoMisBoletas.jpeg')} 
            style={misc.logo} 
            />
            <ThemedText style={[text.detailTitle, { marginBottom: 10 }]}>Crear Cuenta</ThemedText>
            <ThemedText style={[text.cardSubtitle, { textAlign: 'center', marginBottom: 30 }]}>Únete a Mis Boletas</ThemedText>
            
            <View style={{ width: '100%' }}>
            <ThemedText style={text.label}>Nombre *</ThemedText>
            <TextInput
                style={inputs.base}
                placeholder="Tu nombre completo"
                placeholderTextColor="#999"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                autoCapitalize="words"
                editable={!authState.isLoading}
            />

            <ThemedText style={text.label}>Correo electrónico *</ThemedText>
            <TextInput
                style={inputs.base}
                placeholder="tu@correo.com"
                placeholderTextColor="#999"
                value={formData.correo}
                onChangeText={(text) => setFormData({ ...formData, correo: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!authState.isLoading}
            />

            <ThemedText style={text.label}>Contraseña *</ThemedText>
            <TextInput
                style={inputs.base}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                value={formData.contrasena}
                onChangeText={(text) => setFormData({ ...formData, contrasena: text })}
                secureTextEntry
                editable={!authState.isLoading}
            />

            <ThemedText style={text.label}>Confirmar Contraseña *</ThemedText>
            <TextInput
                style={inputs.base}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry
                editable={!authState.isLoading}
            />

            <TouchableOpacity 
                style={[buttons.primary, authState.isLoading && buttons.disabled]}
                onPress={handleRegister}
                disabled={authState.isLoading}
                >
                <ThemedText style={text.buttonText}>
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