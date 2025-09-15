import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {Alert, ScrollView, StyleSheet, Text, TextInput,  TouchableOpacity, View,} from "react-native";

// Interfaz para el producto
interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
}

// Interfaz para representar una categoría
interface Categoria {
  nombre: string;
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
  cantidadProductos: number;
}

// Datos de ejemplo que simulan venir de una base de datos
const todosLosProductos: Producto[] = [
    { id: "1", nombre: "Auto jeep wrangler", tipo: "Auto", icono: "car" },
    { id: "2", nombre: "Lavadora LG 12 kilos", tipo: "Lavadora", icono: "washing-machine" },
    { id: "3", nombre: "Microondas Samsung", tipo: "Microondas", icono: "microwave" },
    { id: "4", nombre: "Auto volkswagen beetle", tipo: "Auto", icono: "car" },
    { id: "5", nombre: "Microondas LG", tipo: "Microondas", icono: "microwave" },
    { id: "6", nombre: "Refrigerador", tipo: "Refrigerador", icono: "fridge" },
];


const Categorias = () => {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  // Para saber qué categoría está seleccionada y mostrar sus productos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  // Para guardar la lista de productos de la categoría seleccionada
  const [productosDeCategoria, setProductosDeCategoria] = useState<Producto[]>([]);
  // Para mostrar/ocultar el mini-formulario
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  // Para manejar el texto del input del nuevo nombre de categoría
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");


  useEffect(() => {
    setTimeout(() => {
      // La lógica para generar categorías a partir de 'todosLosProductos' 
      const categoriasMap = new Map<string, Categoria>();
      todosLosProductos.forEach((producto) => {
        if (!categoriasMap.has(producto.tipo)) {
          categoriasMap.set(producto.tipo, {
            nombre: producto.tipo,
            icono: getIconoPorTipo(producto.tipo),
            cantidadProductos: 0,
          });
        }
        categoriasMap.get(producto.tipo)!.cantidadProductos++;
      });
      const categoriasArray = Array.from(categoriasMap.values());
      setCategorias(categoriasArray);
      setCargando(false);
    }, 1000);
  }, []);

  const getIconoPorTipo = ( tipo: string ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (tipo) {
      case "Auto": return "car";
      case "Lavadora": return "washing-machine";
      case "Microondas": return "microwave";
      case "Refrigerador": return "fridge";
      default: return "shape-outline";
    }
  };


  // Muestra la lista de productos de la categoría seleccionada
  const handleVerCategoria = (categoria: Categoria) => {
    // Filtramos los productos que coinciden con el nombre de la categoría
    const productosFiltrados = todosLosProductos.filter(p => p.tipo === categoria.nombre);
    // Guardamos esos productos en el estado
    setProductosDeCategoria(productosFiltrados);
    // Guardamos la categoría seleccionada para cambiar la vista
    setCategoriaSeleccionada(categoria);
  };

  // Para volver de la lista de productos a la lista de categorías
  const handleVolverACategorias = () => {
    setCategoriaSeleccionada(null);
    setProductosDeCategoria([]); // Limpiamos la lista de productos
  };
  
  // Mostrar el formulario en lugar de navegar
  const handleMostrarFormulario = () => {
    setMostrandoFormulario(true);
  };

  // Guardar la nueva categoría creada en el formulario
  const handleGuardarCategoria = () => {
    const nombreLimpio = nuevoNombreCategoria.trim().toLowerCase();
    if (!nombreLimpio) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío.");
      return;
    }
    // Verificar si la categoría ya existe
    if (categorias.some(cat => cat.nombre === nombreLimpio)) {
      Alert.alert("Error", "Esa categoría ya existe.");
      return;
    }

    // Crear el objeto de la nueva categoría
    const nuevaCategoria: Categoria = {
      nombre: nombreLimpio,
      icono: getIconoPorTipo(nombreLimpio), // Le asignamos un ícono
      cantidadProductos: 0, // Inicia con 0 productos
    };

    // añadir a la lista de categorías existentes
    setCategorias([...categorias, nuevaCategoria]);
    // Ocultar el formulario y limpiamos el input
    setMostrandoFormulario(false);
    setNuevoNombreCategoria("");
  };

  // --- LÓGICA DE RENDERIZADO ---

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  // SI SE SELECCIONÓ UNA CATEGORÍA, MUESTRA LA LISTA DE PRODUCTOS
  if (categoriaSeleccionada) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.botonVolver} onPress={handleVolverACategorias}>
            <Ionicons name="arrow-back" size={24} color="#1976d2" />
            <Text style={styles.botonVolverTexto}>Volver a Categorías</Text>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.titulo}>
            Productos en {categoriaSeleccionada.nombre}
        </ThemedText>

        <ScrollView>
            {productosDeCategoria.map(producto => (
                <TouchableOpacity key={producto.id} style={styles.cardProducto}>
                    <View style={styles.cardContent}>
                        <MaterialCommunityIcons name={producto.icono} size={24} color="#1976d2"/>
                        <Text style={styles.cardTitle}>{producto.nombre}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  }

  // VISTA PRINCIPAL: MUESTRA CATEGORÍAS Y EL FORMULARIO
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titulo}>
        Tus Categorías
      </ThemedText>

      <ScrollView style={styles.scrollContainer}>
        {/* Mostramos la lista de categorías normal */}
        <View style={styles.cardsContainer}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.nombre}
              style={styles.card}
              onPress={() => handleVerCategoria(categoria)}
            >
              <View style={styles.cardContent}>
                <MaterialCommunityIcons name={categoria.icono} size={32} color="#1976d2" />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)}
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
        
        {/* MINI FORMULARIO Y BOTÓN PARA CREAR CATEGORÍA */}
        {mostrandoFormulario ? (
            <View style={styles.formularioContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la nueva categoría"
                    value={nuevoNombreCategoria}
                    onChangeText={setNuevoNombreCategoria}
                />
                <View style={styles.botonesFormulario}>
                    <TouchableOpacity 
                        style={[styles.botonForm, styles.botonCancelar]} 
                        onPress={() => setMostrandoFormulario(false)}>
                        <Text style={styles.botonFormTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.botonForm, styles.botonGuardar]} 
                        onPress={handleGuardarCategoria}>
                        <Text style={[styles.botonFormTexto, { color: '#fff' }]}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <TouchableOpacity style={styles.botonAgregar} onPress={handleMostrarFormulario}>
                <Ionicons name="add-circle-outline" size={24} color="#1976d2" />
                <Text style={styles.botonAgregarTexto}>Crear Nueva Categoría</Text>
            </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 24 },
  scrollContainer: { flex: 1 },
  titulo: { fontSize: 20, textAlign: "center", marginTop: 40, marginBottom: 24 },
  cardsContainer: { width: "100%", gap: 16, marginBottom: 24 },
  card: { backgroundColor: "#ffffff", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderRadius: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  cardContent: { flexDirection: "row", alignItems: "center", gap: 15 },
  cardTextContainer: { flexDirection: "column" },
  cardTitle: { color: "#222", fontSize: 18, fontWeight: "600" },
  cardSubtitle: { color: "#666", fontSize: 14 },
  botonAgregar: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 8, gap: 8, borderWidth: 1, borderColor: "#1976d2", backgroundColor: "#fff" },
  botonAgregarTexto: { color: "#1976d2", fontSize: 16, fontWeight: "600" },

  // Estilos para el botón de volver en la vista de productos
  botonVolver: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  botonVolverTexto: { color: '#1976d2', fontSize: 16, marginLeft: 8, fontWeight: '600' },

  // Estilo para las tarjetas de productos
  cardProducto: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 10 },
  
  // Estilos para el formulario
  formularioContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginTop: 10, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 15 },
  botonesFormulario: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  botonForm: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  botonCancelar: { backgroundColor: '#eee' },
  botonGuardar: { backgroundColor: '#1976d2' },
  botonFormTexto: { fontWeight: '600', fontSize: 16 },
});

export default Categorias;