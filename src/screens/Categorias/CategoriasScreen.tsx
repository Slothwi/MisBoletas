import { ThemedText } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
import categoriaService, { Categoria } from "@/src/services/CategoriaServiceSimplified";
import productoService, { Producto } from "@/src/services/ProductServiceSimplified";
// Importamos todos los estilos necesarios del tema
import { buttons, cards, colors, containers, inputs, misc, text } from '@/src/theme';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Linking, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

// 👇 DEFINICIÓN DEL COMPONENTE
const CategoriasScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [productosDeCategoria, setProductosDeCategoria] = useState<Producto[]>([]);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Estados de edición
  const [categoriasEdicion, setCategoriaEdicion] = useState<Categoria | null>(null);
  const [nombreEdicion, setNombreEdicion] = useState("");
  const [colorEdicion, setColorEdicion] = useState("");
  const [mostrandoEdicion, setMostrandoEdicion] = useState(false);

  const handleAbrirTutorial = () => {
    Linking.openURL('https://www.youtube.com/@misBoletas-App');
  }

  const handleAgregarProducto = () => {
    router.push('/formulario');
  };

  const cargarCategorias = useCallback(async () => {
    if (!authState.isAuthenticated) {
      setCargando(false);
      return;
    }
    try {
      const categoriasDelServidor = await categoriaService.getAll();
      setCategorias(categoriasDelServidor);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las categorías.');
    } finally {
      setCargando(false);
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      cargarCategorias();
    } else if (!authState.isLoading && !authState.isAuthenticated) {
      setCategorias([]);
      setCargando(false);
    }
  }, [authState.isAuthenticated, authState.isLoading, cargarCategorias]);

  const obtenerProductosPorCategoria = async (categoriaId: string) => {
    try {
      const productosFiltrados = await productoService.getByCategory(categoriaId);
      setProductosDeCategoria(productosFiltrados);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los productos de la categoría');
    }
  };

  const handleVerCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    if (categoria.id_categoria) {
      obtenerProductosPorCategoria(categoria.id_categoria);
    }
  };

  const handleVolverACategorias = () => {
    setCategoriaSeleccionada(null);
    setProductosDeCategoria([]);
  };
  
  const handleVolverALista = () => {
    setProductoSeleccionado(null);
  };

  const handleVerProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  const handleEliminarProducto = async (producto: Producto) => {
    Alert.alert('Eliminar Producto', `¿Eliminar "${producto.nombre}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await productoService.delete(producto.id_producto);
              setProductosDeCategoria(p => p.filter(item => item.id_producto !== producto.id_producto));
              Alert.alert('Éxito', 'Producto eliminado');
            } catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
          }
        }
      ]);
  };

  const handleEliminarCategoria = async (categoria: Categoria) => {
    Alert.alert('Eliminar Categoría', `¿Eliminar "${categoria.nombre}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await categoriaService.delete(categoria.id_categoria);
              setCategorias(c => c.filter(item => item.id_categoria !== categoria.id_categoria));
              Alert.alert('Éxito', 'Categoría eliminada');
            } catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
          }
        }
      ]);
  };

  const handleAbrirEdicion = (categoria: Categoria) => {
    setCategoriaEdicion(categoria);
    setNombreEdicion(categoria.nombre);
    setColorEdicion(categoria.color);
    setMostrandoEdicion(true);
  };

  const handleGuardarEdicion = async () => {
    if (!categoriasEdicion || !nombreEdicion.trim()) return;
    try {
      await categoriaService.update(categoriasEdicion.id_categoria, {
        nombre: nombreEdicion.trim(),
        color: colorEdicion,
      });
      setCategorias(c => c.map(cat => cat.id_categoria === categoriasEdicion.id_categoria ? { ...cat, nombre: nombreEdicion.trim(), color: colorEdicion } : cat));
      setMostrandoEdicion(false);
      Alert.alert('Éxito', 'Categoría actualizada');
    } catch (e) { Alert.alert('Error', 'No se pudo actualizar'); }
  };

  const generarColorAleatorio = () => {
    const colores = ['#e77573', '#ff9f5f', '#ffcc66', '#66dd77', '#55d9d9', '#a8cbf0', '#a8a8f0', '#d8a8f0'];
    setColorEdicion(colores[Math.floor(Math.random() * colores.length)]);
  };

  const handleGuardarCategoria = async () => {
    if (!nuevoNombreCategoria.trim()) return;
    try {
      const nueva = await categoriaService.create({
        nombre: nuevoNombreCategoria.trim(),
        color: categoriaService.getRandomColor()
      });
      setCategorias([...categorias, nueva]);
      setMostrandoFormulario(false);
      setNuevoNombreCategoria("");
      Alert.alert("Éxito", "Categoría creada");
    } catch (e) { Alert.alert("Error", "No se pudo crear"); }
  };

  // --- RENDERIZADO ---
  if (authState.isLoading) {
    return <View style={containers.centered}><ThemedText style={text.label}>Cargando...</ThemedText></View>;
  }

  // DETALLE PRODUCTO
  if (productoSeleccionado) {
    return (
      <View style={containers.page}>
        <TouchableOpacity style={misc.backButton} onPress={handleVolverALista}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <ThemedText style={misc.backButtonText}>Volver</ThemedText>
        </TouchableOpacity>
        <ScrollView style={{ flex: 1 }}>
          <View style={[cards.base, { alignItems: 'center' }]}>
            <MaterialCommunityIcons name="package-variant" size={48} color={colors.primary} />
            <ThemedText style={text.detailTitle}>{productoSeleccionado.nombre}</ThemedText>
            {productoSeleccionado.marca && <ThemedText style={text.cardSubtitle}>{productoSeleccionado.marca}</ThemedText>}
          </View>
        </ScrollView>
      </View>
    );
  }

  // LISTA PRODUCTOS
  if (categoriaSeleccionada) {
    return (
      <View style={containers.page}>
        <TouchableOpacity style={misc.backButton} onPress={handleVolverACategorias}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <ThemedText style={misc.backButtonText}>Volver</ThemedText>
        </TouchableOpacity>
        <ThemedText style={text.detailTitle}>{categoriaSeleccionada.nombre}</ThemedText>
        <ScrollView style={{ width: '100%', marginTop: 20 }}>
          {productosDeCategoria.map(prod => (
            <TouchableOpacity key={prod.id_producto} style={cards.interactive} onPress={() => handleVerProducto(prod)}>
              <ThemedText style={text.cardText}>{prod.nombre}</ThemedText>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          ))}
          {productosDeCategoria.length === 0 && <ThemedText style={[text.cardSubtitle, { textAlign: 'center' }]}>Sin productos</ThemedText>}
        </ScrollView>
      </View>
    );
  }

  // LISTA CATEGORÍAS (PRINCIPAL)
  return (
    <View style={containers.page}>
      <ThemedText style={[text.detailTitle, { marginBottom: 20 }]}>Tus Categorías</ThemedText>
      
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {categorias.map((cat) => (
          <View key={cat.id_categoria} style={{ marginBottom: 16 }}>
            <TouchableOpacity style={cards.interactive} onPress={() => handleVerCategoria(cat)}>
              <View style={containers.row}>
                <View style={[misc.colorIndicator, { backgroundColor: cat.color }]} />
                <ThemedText style={text.cardText}>{cat.nombre}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <View style={[containers.row, { justifyContent: 'flex-end', marginTop: 4 }]}>
               <TouchableOpacity onPress={() => handleAbrirEdicion(cat)} style={{ marginRight: 16 }}>
                 <ThemedText style={{ color: colors.secondary, fontSize: 14 }}>Editar</ThemedText>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => handleEliminarCategoria(cat)}>
                 <ThemedText style={{ color: colors.alert, fontSize: 14 }}>Eliminar</ThemedText>
               </TouchableOpacity>
            </View>
          </View>
        ))}

        {mostrandoFormulario ? (
            <View style={cards.base}>
                <TextInput 
                    style={inputs.base} 
                    placeholder="Nueva categoría" 
                    value={nuevoNombreCategoria} 
                    onChangeText={setNuevoNombreCategoria}
                />
                <View style={[containers.row, { marginTop: 10 }]}>
                    <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={() => setMostrandoFormulario(false)}>
                        <ThemedText style={[text.buttonTextColorless, { color: colors.primary }]}>Cancelar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleGuardarCategoria}>
                        <ThemedText style={text.buttonText}>Guardar</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <TouchableOpacity style={[buttons.secondary, { marginTop: 20 }]} onPress={() => setMostrandoFormulario(true)}>
                <ThemedText style={[text.buttonTextColorless, { color: colors.primary }]}>+ Nueva Categoría</ThemedText>
            </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

// 👇 ¡ESTA LÍNEA ES LA MÁS IMPORTANTE!
export default CategoriasScreen;