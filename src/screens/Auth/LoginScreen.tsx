import { ThemedText } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
// 👇 CORRECCIÓN: Importamos estilos del tema
import { buttons, colors, containers, inputs, misc, text } from '@/src/theme';
import { validateEmail } from '@/src/utils/validators';
import secureStorageService from '@/src/services/secureStorageService';
import { logger } from '@/src/utils/logger';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const TAG = 'LoginScreen';

// Base de datos de prueba local
const usuariosPrueba = [
  { id: "3", nombre: "test", contrasena: "test123", email: "test@ejemplo.com" }
];

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [usarBackend, setUsarBackend] = useState(true);
  
  const { login, authState, clearError } = useAuth();

  const autenticarLocal = (correo: string, contrasena: string) => {
    const usuario = usuariosPrueba.find(
      user => user.email === correo && user.contrasena === contrasena
    );
    if (usuario) {
      const tokenSimulado = `local_token_${usuario.id}_${Date.now()}`;
      return { success: true, token: tokenSimulado, user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } };
    } else {
      return { success: false, error: "Credenciales incorrectas" };
    }
  };

  const registrarLocal = (correo: string, contrasena: string) => {
    if (usuariosPrueba.some(user => user.email === correo)) {
      return { success: false, error: "El email ya está registrado" };
    }
    const nuevoUsuario = {
      id: (usuariosPrueba.length + 1).toString(),
      nombre: correo.split('@')[0],
      contrasena,
      email: correo
    };
    usuariosPrueba.push(nuevoUsuario);
    return { success: true, message: "Usuario registrado correctamente" };
  };

  useEffect(() => {
    if (authState.error) {
      Alert.alert("❌ Error", authState.error);
      clearError();
    }
  }, [authState.error, clearError]);

  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      router.replace("/(tabs)");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const handleRegister = async () => {
    if (usarBackend) {
      router.push("/(auth)/register");
    } else {
      if (!correo || !contrasena) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }
      if (!validateEmail(correo)) {
        Alert.alert("Error", "Por favor ingresa un correo válido");
        return;
      }
      const resultado = registrarLocal(correo, contrasena);
      if (resultado.success) {
        Alert.alert("Registro exitoso", resultado.message || "");
        setCorreo("");
        setContrasena("");
      } else {
        Alert.alert("Error", resultado.error || "");
      }
    }
  };

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (!validateEmail(correo)) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    if (usarBackend) {
      try {
        await login({ correo: correo.toLowerCase().trim(), contrasena });
      } catch (err: any) {
        logger.error(TAG, `Login error: ${err.message}`);
      }
    } else {
      const resultado = autenticarLocal(correo, contrasena);
      if (resultado.success && resultado.token && resultado.user) {
        try {
          // Usar secureStorageService en lugar de AsyncStorage directo
          await secureStorageService.storeToken(resultado.token);
          await secureStorageService.storeUser({
            id_usuario: resultado.user.id,
            email: resultado.user.email,
            nombre_completo: resultado.user.nombre,
            fecha_registro: new Date().toISOString(),
          });
          logger.log(TAG, '✅ Local authentication successful');
          await new Promise(resolve => setTimeout(resolve, 500));
          router.replace("/(tabs)");
        } catch (error) {
          logger.error(TAG, `Storage error: ${error}`);
          Alert.alert("Error", "Error al guardar la sesión");
        }
      } else {
        Alert.alert("Error", resultado.error || "Credenciales incorrectas");
      }
    }
  };

  if (authState.isLoading) {
    return (
      <View style={containers.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={misc.loadingText}>Verificando autenticación...</ThemedText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: 20 }}>
          <Image 
            source={require('@/assets/images/logoMisBoletas.jpeg')} 
            style={misc.logo} 
          />
          <ThemedText style={[text.detailTitle, { marginBottom: 10 }]}>Iniciar Sesión</ThemedText>
          <ThemedText style={[text.cardSubtitle, { textAlign: "center", marginBottom: 30 }]}>Ingresa a tu cuenta de Mis Boletas</ThemedText>
          
          <TextInput
            style={inputs.base}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            editable={!authState.isLoading}
          />
          
          <TextInput
            style={inputs.base}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
            editable={!authState.isLoading}
          />
          
          <TouchableOpacity 
            style={buttons.primary} 
            onPress={handleLogin}
            disabled={authState.isLoading}
          >
            <ThemedText style={text.buttonText}>
              {authState.isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[buttons.secondary, { marginBottom: 10 }]} 
            onPress={handleRegister}
            disabled={authState.isLoading}
          >
            <ThemedText style={[text.cardText, { color: colors.primary }]}>
              {usarBackend ? "Crear cuenta nueva" : "Registrarse (Local)"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 15, alignItems: 'center' }}
            onPress={() => router.push('/forgot-password')}
          >
            <ThemedText style={{ color: '#667eea', fontSize: 14, fontWeight: '500' }}>¿Olvidaste tu contraseña?</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}