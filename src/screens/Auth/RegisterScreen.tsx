import { ThemedText } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { buttons, colors, inputs, misc, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons'; 
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

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [recibirNovedades, setRecibirNovedades] = useState(false);

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

    if (!aceptaTerminos) {
        Alert.alert('⚠️ Atención', 'Debes aceptar los Términos y Condiciones para registrarte.');
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
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      } else {
        Alert.alert('✅ ¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
      }
    } catch (err: any) {
      console.log('❌ Error en registro:', err.message);
    }
  };

  // ✅ COMPONENTE CHECKBOX MEJORADO
  // Ahora acepta 'string' O un componente 'ReactNode' para estilos personalizados
  const Checkbox = ({ label, value, onChange, onLabelPress }: { label: string | React.ReactNode, value: boolean, onChange: () => void, onLabelPress?: () => void }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <TouchableOpacity onPress={onChange} style={{ padding: 5 }}>
            <Ionicons 
                name={value ? "checkbox" : "square-outline"} 
                size={24} 
                color={value ? colors.primary : '#999'} 
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLabelPress || onChange} style={{ flex: 1, marginLeft: 8 }}>
            {typeof label === 'string' ? (
                <ThemedText style={{ fontSize: 14, color: '#333' }}>{label}</ThemedText>
            ) : (
                // Si es un componente personalizado (como texto con estilos), lo renderizamos directo
                label
            )}
        </TouchableOpacity>
    </View>
  );

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
                style={[inputs.base, { marginBottom: 20 }]}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry
                editable={!authState.isLoading}
            />

            {/* ✅ CHECKBOX CON ESTILO DE ENLACE */}
            <Checkbox 
                label={
                    <ThemedText style={{ fontSize: 14, color: '#333' }}>
                        Acepto los{' '}
                        <ThemedText style={{ color: colors.primary, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                            Términos y Condiciones
                        </ThemedText>
                    </ThemedText>
                }
                value={aceptaTerminos} 
                onChange={() => setAceptaTerminos(!aceptaTerminos)}
                onLabelPress={() => {
                    // Usamos la ruta pública
                    router.push('/terminos' as any);
                }}
            />
            
            <Checkbox 
                label="Quiero recibir novedades y promociones" 
                value={recibirNovedades} 
                onChange={() => setRecibirNovedades(!recibirNovedades)}
            />

            <TouchableOpacity 
                style={[buttons.primary, (authState.isLoading || !aceptaTerminos) && buttons.disabled]}
                onPress={handleRegister}
                disabled={authState.isLoading}
                >
                <ThemedText style={text.buttonText}>
                {authState.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{ marginTop: 0, padding: 10, alignItems: 'center' }}
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