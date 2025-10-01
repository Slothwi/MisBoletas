import { RootStackParamList } from "@/types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Configuración para FastAPI - IMPORTANTE: Usa tu IP real
const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : Platform.OS === "web"
    ? "http://localhost:3000" // Para web
    : "http://localhost:3000"; // Para iOS simulator

// Base de datos de prueba local
const usuariosPrueba = [
  {
    id: "1",
    username: "usuario1",
    password: "password123",
    email: "usuario1@ejemplo.com"
  },
  {
    id: "2", 
    username: "admin",
    password: "admin123",
    email: "admin@ejemplo.com"
  },
  {
    id: "3",
    username: "test",
    password: "test123", 
    email: "test@ejemplo.com"
  }
];

// Configurar axios para FastAPI
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usarBackend, setUsarBackend] = useState(false); // Toggle entre BD local y backend

  // Función para autenticar contra la base de datos local
  const autenticarLocal = (username: string, password: string) => {
    const usuario = usuariosPrueba.find(
      user => user.username === username && user.password === password
    );
    
    if (usuario) {
      // Simular un token JWT para consistencia con el backend
      const tokenSimulado = `local_token_${usuario.id}_${Date.now()}`;
      return {
        success: true,
        token: tokenSimulado,
        user: {
          id: usuario.id,
          username: usuario.username,
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

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("❌ Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    
    if (usarBackend) {
      // Registrar en el backend
      try {
        const res = await api.post("/register", { 
          username, 
          password 
        });
        Alert.alert("✅ Registro exitoso", res.data.message);
        console.log("✅ Registro exitoso", res.data.message);
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Error desconocido";
        Alert.alert("❌ Error", msg);
        console.log("❌ Error", msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Registrar en la base de datos local
      setTimeout(() => {
        // Verificar si el usuario ya existe
        if (usuariosPrueba.some(user => user.username === username)) {
          Alert.alert("❌ Error", "El usuario ya existe");
          setLoading(false);
          return;
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
          id: (usuariosPrueba.length + 1).toString(),
          username,
          password,
          email: `${username}@ejemplo.com`
        };

        // En una app real, aquí guardarías en AsyncStorage o una BD local
        usuariosPrueba.push(nuevoUsuario);
        
        Alert.alert("✅ Registro exitoso", `Usuario ${username} creado correctamente`);
        console.log("✅ Usuario creado:", nuevoUsuario);
        console.log("📊 Total de usuarios:", usuariosPrueba.length);
        
        setLoading(false);
      }, 1000);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("❌ Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    if (usarBackend) {
      // Login contra el backend
      try {
        const res = await api.post("/login", { 
          username, 
          password 
        });
        
        if (res.data.access_token) {
          await AsyncStorage.setItem("token", res.data.access_token);
          Alert.alert("✅ Login exitoso", "Bienvenido al backend");
          console.log("✅ Login exitoso con backend");
          console.log("🟢 Token recibido:", res.data.access_token);
          
          // Navegar a la pantalla principal
          navigation.reset({
            index: 0,
            routes: [{ name: '(tabs)' as never }],
          });
        } else {
          Alert.alert("❌ Error", "No se recibió token");
          console.log("❌ Error", "No se recibió token");
        }
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Error desconocido";
        Alert.alert("❌ Error", msg);
        console.log("❌ Error", msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Login contra la base de datos local
      setTimeout(() => {
        const resultado = autenticarLocal(username, password);
        
        if (resultado.success && resultado.token) {
          // Guardar el token simulado
          AsyncStorage.setItem("token", resultado.token)
            .then(() => {
              Alert.alert("✅ Login exitoso", `Bienvenido ${username}`);
              console.log("✅ Login exitoso con BD local");
              console.log("🟢 Token simulado:", resultado.token);
              console.log("👤 Usuario:", resultado.user);
              
              // Navegar a la pantalla principal
              navigation.reset({
                index: 0,
                routes: [{ name: '(tabs)' as never }],
              });
            })
            .catch(error => {
              Alert.alert("❌ Error", "Error al guardar la sesión");
              console.error("Error al guardar token:", error);
            });
        } else {
          Alert.alert("❌ Error", resultado.error || "Credenciales incorrectas");
          console.log("❌ Error de autenticación local");
        }
        setLoading(false);
      }, 1000);
    }
  };

  const handlePerfil = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("⚠️ No hay sesión activa", "Inicia sesión primero");
        console.log("⚠️ No hay token guardado");
        return;
      }

      if (usarBackend) {
        // Obtener perfil del backend
        const res = await api.get("/perfil", {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert("👤 Perfil Backend", `ID: ${res.data.user.id}\nUsuario: ${res.data.user.username}`);
      } else {
        // Obtener perfil local
        const tokenParts = token.split('_');
        const userId = tokenParts[2]; // local_token_1_timestamp
        const usuario = usuariosPrueba.find(user => user.id === userId);
        
        if (usuario) {
          Alert.alert("👤 Perfil Local", `ID: ${usuario.id}\nUsuario: ${usuario.username}\nEmail: ${usuario.email}`);
        } else {
          Alert.alert("❌ Error", "Usuario no encontrado");
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Error desconocido";
      Alert.alert("❌ Error", msg);
      console.log("❌ Error", msg);
    }
  };

  const toggleModoAutenticacion = () => {
    setUsarBackend(!usarBackend);
    Alert.alert(
      "Modo de Autenticación Cambiado",
      `Ahora usando: ${!usarBackend ? 'BACKEND (FastAPI)' : 'BASE DE DATOS LOCAL'}\n\nUsuarios de prueba local:\n• usuario1 / password123\n• admin / admin123\n• test / test123`
    );
  };

  const mostrarUsuariosPrueba = () => {
    const usuariosInfo = usuariosPrueba.map(user => 
      `• ${user.username} / ${user.password}`
    ).join('\n');
    
    Alert.alert(
      "👥 Usuarios de Prueba (Local)",
      usuariosInfo
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
        <Text style={styles.modoText}>
          Modo: {usarBackend ? 'Backend' : 'Base de Datos Local'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
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
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, styles.loginButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.registerButton]} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.profileButton]} 
        onPress={handlePerfil}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Ver Perfil</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Información:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>BD Local</Text>: Funciona sin internet
        </Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Backend</Text>: Requiere servidor FastAPI
        </Text>
        <Text style={styles.infoText}>
          • Toca "Ver Usuarios de Prueba" para ver credenciales
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: "#f4f4f4" 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4"
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666"
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#333"
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
  infoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
  },
  registerButton: {
    backgroundColor: "#34C759",
  },
  profileButton: {
    backgroundColor: "#8E8E93",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#455a64',
    marginBottom: 4
  },
  bold: {
    fontWeight: 'bold'
  }
});