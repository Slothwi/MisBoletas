import { ThemedText } from "@/components/ThemedText";
import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from 'react';

const categorias = [
  { title: "Autos" },
  { title: "Lavadoras" },
  { title: "Microondas" },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
        Tus Categorías
      </ThemedText>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {categorias.map((cat, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.cardTitle}>{cat.title}</Text>
            <TouchableOpacity style={styles.cardButton}>
              <Text style={{ color: "#fff" }}>Ver más</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", marginBottom: 40 }}>
        <View style={{ marginHorizontal: 40 }}>
          <TouchableOpacity style={styles.Button}>
            <Text style={{ color: "#fff" }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 40 }}>
          <TouchableOpacity style={styles.Button}>
            <Text style={{ color: "#fff" }}>Crear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#c8cfddff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginVertical: 10,
    width: 260,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  Button: {
   backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});