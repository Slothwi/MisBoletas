import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Interfaz para el producto (necesaria para extraer las categorías)
interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  
}

// Interfaz para representar una categoría
interface Categoria {
  nombre: string;
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
  cantidadProductos: number;
}

const Categorias = () => {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  // Esta función simula la carga de productos y genera las categorías dinámicamente
  useEffect(() => {
    setTimeout(() => {
      // 1. Carga todos los productos existentes (simulado)
      const todosLosProductos: Producto[] = [
        { id: "1", nombre: "Auto jeep wrangler", tipo: "car" },
        { id: "2", nombre: "Lavadora LG 12 kilos", tipo: "washing-machine" },
        { id: "3", nombre: "Microondas Samsung", tipo: "microwave" },
        { id: "4", nombre: "Otro auto", tipo: "car" },
        { id: "5", nombre: "Segundo Microondas", tipo: "microwave" },
        { id: "6", nombre: "Refrigerador", tipo: "fridge" },
      ];

      // 2. Procesa los productos para crear una lista de categorías únicas
      const categoriasMap = new Map<string, Categoria>();

      todosLosProductos.forEach((producto) => {
        if (!categoriasMap.has(producto.tipo)) {
          // Si la categoría no existe, la creamos
          categoriasMap.set(producto.tipo, {
            nombre: producto.tipo,
            // Asigna un ícono genérico o basado en el nombre
            icono: getIconoPorTipo(producto.tipo),
            cantidadProductos: 0,
          });
        }
        // Incrementar el contador de productos para esa categoría
        categoriasMap.get(producto.tipo)!.cantidadProductos++;
      });

      // 3. Convierte el mapa a un array y actualiza el estado
      const categoriasArray = Array.from(categoriasMap.values());
      setCategorias(categoriasArray);
      setCargando(false);
    }, 1000);
  }, []);

  // Función auxiliar para asignar un ícono según el tipo de categoría
  const getIconoPorTipo = (
    tipo: string,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (tipo) {
      case "car":
        return "car";
      case "washing-machine":
        return "washing-machine";
      case "microwave":
        return "microwave";
      case "fridge":
        return "fridge";
      default:
        return "shape-outline"; // Un ícono por defecto
    }
  };

  const handleVerCategoria = (tipoCategoria: string) => {
    // Navega a la pantalla de la categoría específica
    router.push(`/categoria/${tipoCategoria}` as Href);
  };

  const handleCrearCategoria = () => {
    // Navega a un formulario para crear una nueva categoría
    router.push("/crear-categoria" as Href); // hay q crear esta pantalla
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titulo}>
        Tus Categorías
      </ThemedText>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cardsContainer}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.nombre}
              style={styles.card}
              onPress={() => handleVerCategoria(categoria.nombre)}
            >
              <View style={styles.cardContent}>
                <MaterialCommunityIcons
                  name={categoria.icono}
                  size={32}
                  color="#1976d2"
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {/* Capitaliza la primera letra */}
                    {categoria.nombre.charAt(0).toUpperCase() +
                      categoria.nombre.slice(1)}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {categoria.cantidadProductos} producto(s)
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#1976d2" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección para agregar una nueva categoría */}
        <TouchableOpacity
          style={styles.botonAgregar}
          onPress={handleCrearCategoria}
        >
          <Ionicons name="add-circle-outline" size={24} color="#1976d2" />
          <Text style={styles.botonAgregarTexto}>Crear Nueva Categoría</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Estilos para la pantalla de categorías
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  cardsContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  cardTextContainer: {
    flexDirection: "column",
  },
  cardTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#666",
    fontSize: 14,
  },
  botonAgregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#1976d2",
    backgroundColor: "#fff",
  },
  botonAgregarTexto: {
    color: "#1976d2",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Categorias;