import { ThemedText } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import categoriaService, { Categoria } from "@/src/services/CategoriaServiceSimplified";
import productoService, { Producto } from "@/src/services/ProductServiceSimplified";
import { buttons, cards, colors, containers, inputs, misc, text } from '@/src/theme';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Modal, ScrollView, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";

const CategoriasScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // ✅ ESTILOS DINÁMICOS CORREGIDOS
  const bgColor = isDark ? colors.backgroundDark : colors.background;
  // Fondo de tarjetas: en dark usa un gris oscuro, en light blanco
  const cardBg = isDark ? colors.cardDark : '#ffffff'; 
  const textColor = isDark ? colors.textLight : colors.textDark;
  const subTextColor = isDark ? '#aaaaaa' : '#666666';
  const borderColor = isDark ? '#333' : '#ddd';
  const iconColor = isDark ? '#fff' : colors.primary;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para manejo de datos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [productosDeCategoria, setProductosDeCategoria] = useState<Producto[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");
  const [nuevoColorCategoria, setNuevoColorCategoria] = useState<string>(categoriaService.getRandomColor());
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);
  const [nombreEdicion, setNombreEdicion] = useState("");
  const [mostrandoEdicion, setMostrandoEdicion] = useState(false);

  // --- CARGA DE DATOS ---
  const cargarCategorias = useCallback(async () => {
    // ✅ CORRECCIÓN CLAVE: Si no está autenticado, paramos la carga para no dejar el spinner infinito
    if (!authState.isAuthenticated) {
        setCargando(false);
        return;
    }
    
    setCargando(true); // Reiniciar spinner al intentar cargar
    try {
      const datos = await categoriaService.getAll();
      setCategorias(datos);
    } catch (error: any) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }, [authState.isAuthenticated]); // ✅ Se ejecuta cuando cambia el estado de auth

  useFocusEffect(
    useCallback(() => {
      cargarCategorias();
    }, [cargarCategorias])
  );

  // --- LÓGICA DE PRODUCTOS ---
  const handleVerCategoria = async (categoria: Categoria) => {
    setProductosDeCategoria([]); 
    setCargandoProductos(true);
    setCategoriaSeleccionada(categoria);

    try {
        const prods = await productoService.getByCategory(categoria.id_categoria);
        setProductosDeCategoria(prods);
    } catch {
        setProductosDeCategoria([]);
    } finally {
        setCargandoProductos(false);
    }
  };

  const handleVerProducto = (producto: Producto) => {
    const productoParaEditar = { ...producto };
    if (categoriaSeleccionada) {
        productoParaEditar.categorias = [{
            id_categoria: categoriaSeleccionada.id_categoria,
            nombre: categoriaSeleccionada.nombre,
            color: categoriaSeleccionada.color
        }];
    }
    router.push({ 
        pathname: '/formulario', 
        params: { producto: JSON.stringify(productoParaEditar), modoEdicion: 'true' } 
    } as any);
  };

  // --- LÓGICA ABM CATEGORÍAS ---
  const handleGuardarCategoria = async () => {
    if (!nuevoNombreCategoria.trim()) return;
    try {
      await categoriaService.create({
        nombre: nuevoNombreCategoria.trim(),
        color: nuevoColorCategoria
      });
      setNuevoNombreCategoria("");
      setNuevoColorCategoria(categoriaService.getRandomColor());
      setMostrandoFormulario(false);
      cargarCategorias();
      Alert.alert("Éxito", "Categoría creada");
    } catch (e) { Alert.alert("Error", "No se pudo crear"); }
  };

  const handleEliminarCategoria = (cat: Categoria) => {
    Alert.alert('Eliminar', `¿Borrar "${cat.nombre}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
            try {
                await categoriaService.delete(cat.id_categoria);
                setCategorias(prev => prev.filter(c => c.id_categoria !== cat.id_categoria));
            } catch { Alert.alert('Error', 'No se pudo eliminar'); }
        }}
    ]);
  };

  const handleIniciarEdicion = (cat: Categoria) => {
    setCategoriaAEditar(cat);
    setNombreEdicion(cat.nombre);
    setMostrandoEdicion(true);
  };

  const handleGuardarEdicion = async () => {
    if (!categoriaAEditar || !nombreEdicion.trim()) return;
    try {
        await categoriaService.update(categoriaAEditar.id_categoria, {
            nombre: nombreEdicion.trim(),
            color: categoriaAEditar.color
        });
        setMostrandoEdicion(false);
        setCategoriaAEditar(null);
        cargarCategorias();
        Alert.alert('Actualizado', 'Categoría editada correctamente');
    } catch {
        Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  if (cargando) return <View style={[containers.centered, { backgroundColor: bgColor }]}><ActivityIndicator color={colors.primary} /></View>;

  // VISTA: LISTA DE PRODUCTOS DE UNA CATEGORÍA
  if (categoriaSeleccionada) {
    return (
        <View style={[containers.page, { backgroundColor: bgColor }]}>
            <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => setCategoriaSeleccionada(null)} style={{ padding: 8, marginLeft: -8, width: 40 }}>
                    <Ionicons name="arrow-back" size={26} color={colors.primary} />
                </TouchableOpacity>
                <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0, color: textColor, textAlign: 'center' }]}>
                    {categoriaSeleccionada.nombre}
                </ThemedText>
                <View style={{ width: 40 }} /> 
            </View>
            
            <ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 16 }}>
                {cargandoProductos ? (
                    <View style={{ marginTop: 20 }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : productosDeCategoria.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <MaterialCommunityIcons name="package-variant" size={48} color={subTextColor} />
                        <ThemedText style={{ textAlign: 'center', color: subTextColor, marginTop: 10 }}>Sin productos en esta categoría</ThemedText>
                    </View>
                ) : (
                    productosDeCategoria.map(prod => (
                        <TouchableOpacity 
                            key={prod.id_producto} 
                            style={[cards.interactive, { 
                                backgroundColor: cardBg, // ✅ Usar variable dinámica
                                borderColor: borderColor, 
                                borderWidth: 1, 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                marginBottom: 12
                            }]}
                            onPress={() => handleVerProducto(prod)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <MaterialCommunityIcons name="package-variant" size={24} color={colors.primary} />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <ThemedText style={[text.cardText, { color: textColor }]} numberOfLines={1}>{prod.nombre}</ThemedText>
                                    {prod.marca && <ThemedText style={{ fontSize: 12, color: subTextColor }}>{prod.marca}</ThemedText>}
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={iconColor} />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
  }

  // VISTA PRINCIPAL: LISTA DE CATEGORÍAS
  return (
    <View style={[containers.page, { backgroundColor: bgColor }]}>
      <ThemedText style={[text.detailTitle, { color: colors.primary }]}>Tus Categorías</ThemedText>
      
      <ScrollView style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}>
        {categorias.map((cat) => (
          <View 
            key={cat.id_categoria} 
            style={[cards.interactive, { 
                backgroundColor: cardBg, // ✅ Dinámico
                borderColor: borderColor,
                borderWidth: 1,
                paddingVertical: 12,
                paddingHorizontal: 12,
                marginBottom: 12,
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between'
            }]}
          >
            <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} 
                onPress={() => handleVerCategoria(cat)}
            >
                <View style={[misc.colorIndicator, { backgroundColor: cat.color, width: 14, height: 14, borderRadius: 7, marginRight: 12 }]} />
                <View>
                    <ThemedText style={{ fontSize: 16, fontWeight: '600', color: textColor }}>{cat.nombre}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: subTextColor }}>
                        {cat.numero_productos || 0} {(cat.numero_productos === 1) ? 'producto' : 'productos'}
                    </ThemedText>
                </View>
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                  onPress={() => handleIniciarEdicion(cat)} 
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ padding: 6, backgroundColor: isDark ? '#333' : '#f0f0f0', borderRadius: 20 }}
              >
                <Ionicons name="pencil" size={18} color={colors.secondary} />
              </TouchableOpacity>

              <TouchableOpacity 
                  onPress={() => handleEliminarCategoria(cat)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ padding: 6, backgroundColor: isDark ? '#333' : '#f0f0f0', borderRadius: 20 }}
              >
                <Ionicons name="trash" size={18} color={colors.alert} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {mostrandoFormulario ? (
          <View style={[cards.base, { backgroundColor: cardBg, marginTop: 10, borderColor: colors.primary, borderWidth: 1 }]}>
            <ThemedText style={{ marginBottom: 8, fontWeight: 'bold', color: textColor }}>Nueva Categoría</ThemedText>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <TouchableOpacity onPress={() => setNuevoColorCategoria(categoriaService.getRandomColor())} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: nuevoColorCategoria, marginRight: 10, borderWidth: 1, borderColor: '#eee' }} />
              <ThemedText style={{ color: textColor }}>Toca el círculo para cambiar color</ThemedText>
            </View>

            <TextInput 
              style={[inputs.base, { backgroundColor: '#ffffff', color: '#000000', borderColor: isDark ? colors.primary : '#ddd' }]} 
              placeholder="Nombre..." 
              placeholderTextColor={'#999999'}
              value={nuevoNombreCategoria}  
              onChangeText={setNuevoNombreCategoria}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[buttons.secondary, { flex: 1, backgroundColor: isDark ? '#fff' : '#ddd' }]} onPress={() => setMostrandoFormulario(false)}>
                <ThemedText style={{ color: isDark ? '#222' : colors.textMuted, textAlign: 'center' }}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleGuardarCategoria}>
                <ThemedText style={text.buttonText}>Crear</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[buttons.secondary, { marginTop: 20, marginBottom: 40, backgroundColor: isDark ? '#f5f7fa' : '#f5f7fa', borderWidth: 1, borderColor: colors.primary }]}
            onPress={() => { setNuevoNombreCategoria(''); setNuevoColorCategoria(categoriaService.getRandomColor()); setMostrandoFormulario(true); }}
          >
            <ThemedText style={{ color: colors.primary, fontWeight: 'bold', textAlign: 'center' }}>+ Nueva Categoría</ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal Edición */}
      <Modal visible={mostrandoEdicion} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
            <View style={{ backgroundColor: cardBg, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: borderColor }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: textColor }}>Editar Categoría</ThemedText>
                
                <TextInput 
                  style={[inputs.base, { backgroundColor: '#ffffff', color: '#000000', marginBottom: 20, borderColor: borderColor }]} 
                  value={nombreEdicion}
                  onChangeText={setNombreEdicion}
                  placeholder="Nombre de categoría"
                  placeholderTextColor={'#999999'}
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={[buttons.secondary, { flex: 1, backgroundColor: isDark ? '#fff' : '#ddd' }]} onPress={() => setMostrandoEdicion(false)}>
                        <ThemedText style={{ textAlign: 'center', color: isDark ? '#222' : subTextColor }}>Cancelar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleGuardarEdicion}>
                        <ThemedText style={text.buttonText}>Guardar</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
};

export default CategoriasScreen;