import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import  { useRouter } from "expo-router";

export default function Bienvenida() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
    <View style={styles.container}>
      <Image source={require('../assets/images/logoMisBoletas.jpeg')} style={styles.imagenLogo} />
      <Text style={styles.title}>¡Bienvenido a la App Mis Boletas!</Text>
      <Text style={styles.subtitle}>Explora nuestras funcionalidades</Text>
      <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
        <Text style={styles.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a8cbf0",
  },
  imagenLogo:{
    width: 140,
    height: 140,
    marginBottom: 30,
    borderRadius: 70,    
    resizeMode: 'cover',
    borderColor: '#222',       
    borderWidth: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#222",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#e77573",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});