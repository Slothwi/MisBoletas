import { ThemedText, ThemedTextInput, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { buttons, colors, containers, inputs, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View, Alert } from 'react-native';

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }

    try {
      setCargando(true);
      await login({ 
        correo, 
        contrasena,
        rememberMe: recordarme 
      });
      // El hook useAuth o router manejará la redirección
    } catch (error: any) {
      Alert.alert('Error de inicio de sesión', error.message || 'Ocurrió un error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    // ✅ CORREGIDO: containers.centered en lugar de containers.center
    <ThemedView style={[containers.centered, { padding: spacing.xl }]}>
      
      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Image 
          source={require('@/assets/images/logoMisBoletas.jpeg')} 
          style={{ width: 100, height: 100, borderRadius: 20 }}
          resizeMode="contain"
        />
        {/* ✅ CORREGIDO: text.detailTitle en lugar de text.title */}
        <ThemedText style={[text.detailTitle, { marginTop: 20 }]}>Mis Boletas</ThemedText>
        {/* ✅ CORREGIDO: text.emptyStateSubtitle en lugar de text.subtitle */}
        <ThemedText style={text.emptyStateSubtitle}>Inicia sesión para continuar</ThemedText>
      </View>

      {/* Formulario */}
      <View style={{ width: '100%', gap: 16 }}>
        <View style={inputs.container}>
          <ThemedText style={text.label}>Correo Electrónico</ThemedText>
          <ThemedTextInput
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={inputs.container}>
          <ThemedText style={text.label}>Contraseña</ThemedText>
          <ThemedTextInput
            placeholder="********"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
          />
          <TouchableOpacity 
            onPress={() => router.push('/forgot-password')}
            style={{ alignSelf: 'flex-end', marginTop: 8 }}
          >
            <ThemedText style={{ color: colors.primary, fontSize: 14 }}>
              ¿Olvidaste tu contraseña?
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Checkbox Recordarme */}
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => setRecordarme(!recordarme)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={recordarme ? "checkbox" : "square-outline"} 
            size={24} 
            color={recordarme ? colors.primary : '#888'} 
          />
          <ThemedText style={{ marginLeft: 8, color: '#666' }}>
            Recordarme
          </ThemedText>
        </TouchableOpacity>

        {/* Botón Login */}
        <TouchableOpacity 
          style={[buttons.primary, { opacity: cargando ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={text.buttonText}>Iniciar Sesión</ThemedText>
          )}
        </TouchableOpacity>

        {/* Registro */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <ThemedText>¿No tienes cuenta? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <ThemedText style={{ color: colors.primary, fontWeight: 'bold' }}>
              Regístrate
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
};

export default LoginScreen;