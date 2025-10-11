// app/(auth)/register.tsx
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  KeyboardAvoidingView,
  Platform,
  Image
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
      
      Alert.alert('✅ ¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
    } catch (err: any) {
      console.log('❌ Error en registro:', err.message);
      // El error ya se muestra mediante el useEffect de authState.error
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Image 
            source={require('@/assets/images/logoMisBoletas.jpeg')} 
            style={styles.imagenLogo} 
          />
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a Mis Boletas</Text>
          
          <View style={styles.form}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              placeholderTextColor="#999"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              autoCapitalize="words"
              editable={!authState.isLoading}
            />

            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              placeholderTextColor="#999"
              value={formData.correo}
              onChangeText={(text) => setFormData({ ...formData, correo: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!authState.isLoading}
            />

            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              value={formData.contrasena}
              onChangeText={(text) => setFormData({ ...formData, contrasena: text })}
              secureTextEntry
              editable={!authState.isLoading}
            />

            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              editable={!authState.isLoading}
            />

            <TouchableOpacity 
              style={[styles.button, authState.isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={authState.isLoading}
            >
              <Text style={styles.buttonText}>
                {authState.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => router.back()}
              disabled={authState.isLoading}
            >
              <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a8cbf0',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  imagenLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 60,    
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#e77573',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});