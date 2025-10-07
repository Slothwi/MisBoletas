import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, register, loading, error, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      Alert.alert("❌ Error", error.message);
      clearError();
    }
  }, [error, clearError]);

  const handleRegister = async () => {
    router.push("/(auth)/register");
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("❌ Error", "Por favor completa todos los campos");
      return;
    }

    try {
      await login({ username, password });
      Alert.alert("✅ Login exitoso", "Bienvenido");
      
      // Navegar a la pantalla principal - Expo Router v54
      router.replace("/(tabs)");
    } catch (err) {
      console.log("❌ Error en login");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/logoMisBoletas.jpeg')} 
        style={styles.imagenLogo} 
      />
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
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
        <Text style={styles.loginButtonText}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.registerButton]} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          {loading ? "Cargando..." : "Registrarse"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: "#a8cbf0" 
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
    marginBottom: 30,
    alignSelf: 'center',
    borderRadius: 70,    
    resizeMode: 'cover',
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30, 
    textAlign: "center",
    color: "#333"
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
  }
});