import { AppStyles, ThemedText } from "@/components";
import { useAuth } from "@/src/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// Base de datos de prueba local
const usuariosPrueba = [
  {
    id: "3",
    nombre: "test",
    contrasena: "test123", 
    email: "test@ejemplo.com"
  }
];

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [usarBackend, setUsarBackend] = useState(true);
  
  const { login, authState, clearError } = useAuth();

  // Función para autenticar contra la base de datos local
  const autenticarLocal = (correo: string, contrasena: string) => {
    const usuario = usuariosPrueba.find(
      user => user.email === correo && user.contrasena === contrasena
    );
    
    if (usuario) {
      const tokenSimulado = `local_token_${usuario.id}_${Date.now()}`;
      return {
        success: true,
        token: tokenSimulado,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        }
      };
    } else {
      return {
        success: false,
        error: "Credenciales incorrectas"
      };
    }
  };

  // Función para registrar usuario local
  const registrarLocal = (correo: string, contrasena: string) => {
    if (usuariosPrueba.some(user => user.email === correo)) {
      return {
        success: false,
        error: "El email ya está registrado"
      };
    }

    const nuevoUsuario = {
      id: (usuariosPrueba.length + 1).toString(),
      nombre: correo.split('@')[0],
      contrasena,
      email: correo
    };

    usuariosPrueba.push(nuevoUsuario);
    return {
      success: true,
      message: "Usuario registrado correctamente"
    };
  };

  useEffect(() => {
    if (authState.error) {
      Alert.alert("❌ Error", authState.error);
      clearError();
    }
  }, [authState.error, clearError]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      router.replace("/(tabs)");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const handleRegister = async () => {
    if (usarBackend) {
      router.push("/(auth)/register");
    } else {
      // Registro local
      if (!correo || !contrasena) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        Alert.alert("Error", "Por favor ingresa un correo válido");
        return;
      }

      const resultado = registrarLocal(correo, contrasena);
      if (resultado.success) {
        Alert.alert("Registro exitoso", resultado.message);
        console.log("Usuario creado localmente");
        setCorreo("");
        setContrasena("");
      } else {
        Alert.alert("Error", resultado.error);
      }
    }
  };

  const mostrarUsuariosPrueba = () => {
    const usuariosInfo = usuariosPrueba.map(user => 
      `• ${user.email} / ${user.contrasena}`
    ).join('\n');
    
    Alert.alert(
      "Usuarios de Prueba (Local)",
      usuariosInfo
    );
  };

  const toggleModoAutenticacion = () => {
    setUsarBackend(!usarBackend);
    Alert.alert(
      "Modo de Autenticacion Cambiado",
      `Ahora usando: ${!usarBackend ? 'BACKEND' : 'BASE DE DATOS LOCAL'}\n\nUsuarios de prueba local:\n• usuario1@ejemplo.com / password123\n• admin@ejemplo.com / admin123\n• test@ejemplo.com / test123`
    );
  };

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    // Validacion basica del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Alert.alert("Error", "Por favor ingresa un correo valido");
      return;
    }

    if (usarBackend) {
      // Login contra el backend
      try {
        await login({ correo: correo.toLowerCase().trim(), contrasena });
        Alert.alert("Login exitoso", "Bienvenido");
      } catch (err: any) {
        console.log("❌ Error en login:", err.message);
      }
    } else {
      // Login contra la base de datos local
      const resultado = autenticarLocal(correo, contrasena);
      
      if (resultado.success && resultado.token) {
        try {
          // Guardar en AsyncStorage con la estructura correcta del tipo User
          await AsyncStorage.setItem("@MisBoletas:auth_token", resultado.token);
          await AsyncStorage.setItem("@MisBoletas:user_data", JSON.stringify({
            idUsuario: parseInt(resultado.user.id),
            nombre: resultado.user.nombre,
            correo: resultado.user.email,
            fechaRegistro: new Date().toISOString(),
          }));
          
          Alert.alert("Login exitoso", `Bienvenido ${resultado.user.nombre}`);
          console.log("Login exitoso con BD local");
          console.log("Token simulado:", resultado.token);
          console.log("Usuario:", resultado.user);
          
          // Esperar un momento para asegurar que AsyncStorage guarde los datos
          await new Promise(resolve => setTimeout(resolve, 500));
          
          router.replace("/(tabs)");
        } catch (error) {
          Alert.alert("Error", "Error al guardar la sesion");
          console.error("Error al guardar token:", error);
        }
      } else {
        Alert.alert("Error", resultado.error || "Credenciales incorrectas");
        console.log("Error de autenticacion local");
      }
    }
  };

  if (authState.isLoading) {
    return (
      <View style={AppStyles.containers.centered}>
        <ActivityIndicator size="large" color={AppStyles.colors.primary} />
        <ThemedText style={AppStyles.misc.loadingText}>Verificando autenticación...</ThemedText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: AppStyles.colors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: 20 }}>
          <Image 
            source={require('@/assets/images/logoMisBoletas.jpeg')} 
            style={AppStyles.misc.logo} 
          />
          <ThemedText style={[AppStyles.text.detailTitle, { marginBottom: 10 }]}>Iniciar Sesión</ThemedText>
          <ThemedText style={[AppStyles.text.cardSubtitle, { textAlign: "center", marginBottom: 30 }]}>Ingresa a tu cuenta de Mis Boletas</ThemedText>
          
          {/* Se elimina botón de backend/local por ahora
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' }}>
            <ThemedText style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>
              Modo: {usarBackend ? 'Backend' : 'Base de Datos Local'}
            </ThemedText>
            <TouchableOpacity 
              style={{ backgroundColor: '#FFA500', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
              onPress={toggleModoAutenticacion}
            >
              <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                {usarBackend ? 'Usar BD Local' : 'Usar Backend'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {!usarBackend && (
            <TouchableOpacity 
              style={{ backgroundColor: '#6c757d', padding: 12, borderRadius: 8, marginBottom: 15, alignItems: 'center' }}
              onPress={mostrarUsuariosPrueba}
            >
              <ThemedText style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>👥 Ver Usuarios de Prueba</ThemedText>
            </TouchableOpacity>
          )}
          */}
          <TextInput
            style={AppStyles.inputs.base}
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
            style={AppStyles.inputs.base}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
            editable={!authState.isLoading}
          />
          
          <TouchableOpacity 
            style={AppStyles.buttons.primary} 
            onPress={handleLogin}
            disabled={authState.isLoading}
          >
            <ThemedText style={AppStyles.text.buttonText}>
              {authState.isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[AppStyles.buttons.secondary, { marginBottom: 10 }]} 
            onPress={handleRegister}
            disabled={authState.isLoading}
          >
            <ThemedText style={[AppStyles.text.cardText, { color: AppStyles.colors.primary }]}>
              {usarBackend ? "Crear cuenta nueva" : "Registrarse (Local)"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 15, alignItems: 'center' }}
            onPress={() => router.push('./forgot-password.tsx')}
          >
            <ThemedText style={{ color: '#667eea', fontSize: 14, fontWeight: '500' }}>¿Olvidaste tu contraseña?</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}