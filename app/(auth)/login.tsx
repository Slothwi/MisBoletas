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
  StyleSheet,
  Text,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando autenticación...</Text>
      </View>
    );
  }

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
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Ingresa a tu cuenta de Mis Boletas</Text>
          
          <View style={styles.modoContainer}>
            <Text style={styles.modoText}>
              Modo: {usarBackend ? 'Backend' : 'Base de Datos Local'}
            </Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={toggleModoAutenticacion}
            >
              <Text style={styles.toggleButtonText}>
                {usarBackend ? 'Usar BD Local' : 'Usar Backend'}
              </Text>
            </TouchableOpacity>
          </View>

          {!usarBackend && (
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={mostrarUsuariosPrueba}
            >
              <Text style={styles.infoButtonText}>👥 Ver Usuarios de Prueba</Text>
            </TouchableOpacity>
          )}
          
          <TextInput
            style={styles.input}
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
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
            editable={!authState.isLoading}
          />
          
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]} 
            onPress={handleLogin}
            disabled={authState.isLoading}
          >
            <Text style={styles.loginButtonText}>
              {authState.isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.registerButton]} 
            onPress={handleRegister}
            disabled={authState.isLoading}
          >
            <Text style={styles.registerButtonText}>
              {usarBackend ? "Crear cuenta nueva" : "Registrarse (Local)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#a8cbf0" 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a8cbf0"
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666"
  },
  imagenLogo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 70,    
    resizeMode: 'cover',
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center",
    color: "#333"
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 16,
    color: "#333"
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#e77573",
  },
  registerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e77573"
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButtonText: {
    color: "#e77573",
    fontSize: 16,
    fontWeight: "bold",
  },
  modoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  modoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  toggleButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  infoButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center'
  },
  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
});