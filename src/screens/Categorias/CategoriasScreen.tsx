import { ThemedText } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import categoriaService, { Categoria } from "@/src/services/CategoriaServiceSimplified";
import productoService, { Producto } from "@/src/services/ProductServiceSimplified";
// Importamos todos los estilos necesarios del tema
import { buttons, cards, colors, containers, inputs, misc, text } from '@/src/theme';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Linking, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

// 👇 DEFINICIÓN DEL COMPONENTE
const CategoriasScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [todosProductos, setTodosProductos] = useState<Producto[]>([]);

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
      const productosDelServidor = await productoService.getAll();
      setCategorias(categoriasDelServidor);
      setTodosProductos(productosDelServidor);
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

  // ✅ ARREGLADO: Recargar datos cuando la pantalla se enfoca (vuelve del formulario)
  useFocusEffect(
    useCallback(() => {
      cargarCategorias();
    }, [cargarCategorias])
  );

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
    const handleEditarProducto = (producto: Producto) => {
      if (!producto.id_producto) return;
      router.push({ pathname: '/formulario', params: { producto: JSON.stringify(producto), modoEdicion: 'true' } } as any);
    };

    return (
      <View style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        {/* Header con botón atrás */}
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setProductoSeleccionado(null)} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
          {/* Tarjeta principal con producto */}
          <View style={[cards.base, { backgroundColor: isDark ? colors.cardDark : '#fff', position: 'relative', marginBottom: 24 }]}>
            {/* Botón editar superpuesto */}
            <TouchableOpacity 
              onPress={() => handleEditarProducto(productoSeleccionado)}
              style={{ 
                position: 'absolute', 
                top: 12, 
                right: 12, 
                backgroundColor: colors.primary, 
                width: 44, 
                height: 44, 
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <MaterialCommunityIcons name="pencil" size={22} color="#fff" />
            </TouchableOpacity>

            {/* Contenido */}
            <View style={{ alignItems: 'center', paddingRight: 50 }}>
              <MaterialCommunityIcons name="package-variant" size={56} color={colors.primary} style={{ marginBottom: 12 }} />
              <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 8, textAlign: 'center' }]}>
                {productoSeleccionado.nombre}
              </ThemedText>
              {productoSeleccionado.marca && (
                <ThemedText style={[text.cardSubtitle, { textAlign: 'center', fontSize: 14 }]}>
                  {productoSeleccionado.marca}
                </ThemedText>
              )}
              {productoSeleccionado.descripcion && (
                <ThemedText style={[text.cardText, { marginTop: 12, textAlign: 'center', fontSize: 13, color: colors.textMuted }]}>
                  {productoSeleccionado.descripcion}
                </ThemedText>
              )}
              {productoSeleccionado.fecha_compra && (
                <ThemedText style={[text.cardSubtitle, { marginTop: 12, fontSize: 12 }]}>
                  Comprado: {new Date(productoSeleccionado.fecha_compra).toLocaleDateString()}
                </ThemedText>
              )}
            </View>
          </View>

          {/* Botón eliminar */}
          <TouchableOpacity 
            style={[buttons.danger, { marginBottom: 20 }]} 
            onPress={() => handleEliminarProducto(productoSeleccionado)}
          >
            <Ionicons name="trash" size={18} color="#fff" style={{ marginRight: 8 }} />
            <ThemedText style={[text.buttonText]}>Eliminar Producto</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // LISTA PRODUCTOS
  if (categoriaSeleccionada) {
    return (
      <View style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleVolverACategorias} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
            {categoriaSeleccionada.nombre}
          </ThemedText>
        </View>
        <ThemedText style={[text.cardTitle, { marginHorizontal: 16, marginBottom: 12, color: colors.primary, fontSize: 18, fontWeight: '600' }]}>Tus Productos</ThemedText>
        <ScrollView style={{ width: '100%', flex: 1, paddingHorizontal: 16 }}>
          {productosDeCategoria.map(prod => (
            <TouchableOpacity key={prod.id_producto} style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, marginBottom: 12 }]} onPress={() => handleVerProducto(prod)}>
              <ThemedText style={[text.cardText, { color: colors.textDark }]}>{prod.nombre}</ThemedText>
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
    <View style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
      <ThemedText style={text.detailTitle}>Tus Categorías</ThemedText>
      
      <ScrollView style={{ flex: 1, width: "100%", paddingHorizontal: 16, marginTop: 8 }}>
        {categorias.map((cat) => {
          const numProductos = todosProductos.filter(p => 
            p.categorias?.some(c => c.id_categoria === cat.id_categoria)
          ).length || 0;
          return (
          <View key={cat.id_categoria} style={{ marginBottom: 16 }}>
            <TouchableOpacity style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]} onPress={() => handleVerCategoria(cat)}>
              <View style={containers.row}>
                <View style={[misc.colorIndicator, { backgroundColor: cat.color }]} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={[text.cardText, { color: colors.textDark }]}>{cat.nombre}</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{numProductos} {numProductos === 1 ? 'producto' : 'productos'}</ThemedText>
                </View>
              </View>
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
        );
        })}

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