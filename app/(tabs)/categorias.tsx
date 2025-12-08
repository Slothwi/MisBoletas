import { AppStyles, ThemedText } from "@/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BASE_URL } from "../../src/constants/config";
import { useAuth } from "../../src/hooks/useAuth";
import categoriaService, { Categoria } from "../../src/services/CategoriaServiceSimplified";
import productoService, { Producto } from "../../src/services/ProductServiceSimplified";

const Categorias = () => {
  const router = useRouter();
  const { authState } = useAuth();
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
  
  // MOSTRAR PRODUCTO SELECCIONADO
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  //Función para abrir URL externa (video tutorial).
  const handleAbrirTutorial = () => {
    Linking.openURL('https://www.youtube.com/@misBoletas-App');
  }

  // Función para navegar al formulario
  const handleAgregarProducto = () => {
    // Navegar al formulario usando type assertion
    router.push('./formulario');
  };

  // Cargar categorías del backend
  const cargarCategorias = useCallback(async () => {
    if (!authState.isAuthenticated) {
      console.log('❌ No se puede cargar categorías: usuario no autenticado');
      setCargando(false);
      return;
    }

    try {
      console.log('📂 Cargando categorías del servidor...');
      console.log('🔐 Usuario autenticado:', authState.user?.email);
      console.log('🔗 Token disponible:', !!authState.token);
      console.log('🌐 Base URL:', BASE_URL);
      console.log('📍 Endpoint completo:', `${BASE_URL}/categorias/`);
      
      const categoriasDelServidor = await categoriaService.getAll();
      console.log('📦 Respuesta del servidor:', categoriasDelServidor);
      
      setCategorias(categoriasDelServidor);
      console.log(`✅ ${categoriasDelServidor.length} categorías cargadas`);
    } catch (error: any) {
      console.error('❌ Error completo cargando categorías:', {
        message: error.message,
        type: error.type,
        status: error.status,
        stack: error.stack
      });
      
      Alert.alert(
        'Error', 
        error.message || 'No se pudieron cargar las categorías.',
        [
          { text: 'Reintentar', onPress: cargarCategorias },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setCargando(false);
    }
  }, [authState.isAuthenticated, authState.token, authState.user?.email]);

  // Cargar categorías al inicializar
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      cargarCategorias();
    } else if (!authState.isLoading && !authState.isAuthenticated) {
      setCategorias([]);
      setCargando(false);
    }
  }, [authState.isAuthenticated, authState.isLoading, cargarCategorias]);

  // Obtener productos por categoría
  const obtenerProductosPorCategoria = async (categoriaId: string) => {  // Cambio: Era "number" → Ahora "string" (UUID)
    try {
      console.log(`📦 Cargando productos de categoría ${categoriaId}...`);
      const productosFiltrados = await productoService.getByCategory(categoriaId);
      setProductosDeCategoria(productosFiltrados);
      console.log(`✅ ${productosFiltrados.length} productos encontrados`);
    } catch (error: any) {
      console.error('❌ Error cargando productos de categoría:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos de la categoría');
    }
  };

  // Muestra la lista de productos de la categoría seleccionada
  const handleVerCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    if (categoria.id_categoria) {  // Cambio: Era "CategoriaID" → Ahora "id_categoria" (UUID)
      obtenerProductosPorCategoria(categoria.id_categoria);
    }
  };

  // Para volver de la lista de productos a la lista de categorías
  const handleVolverACategorias = () => {
    setCategoriaSeleccionada(null);
    setProductosDeCategoria([]);
  };
  
  // Para volver de la vista de detalle del producto a la lista de productos
  const handleVolverALista = () => {
    setProductoSeleccionado(null);
  };

  const handleVerProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  // Eliminar producto de la categoría
  const handleEliminarProducto = async (producto: Producto) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${producto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Eliminando producto:', producto.id_producto);
              await productoService.delete(producto.id_producto);
              console.log('✅ Producto eliminado exitosamente');
              
              // Actualizar la lista local
              setProductosDeCategoria(
                productosDeCategoria.filter(p => p.id_producto !== producto.id_producto)
              );
              
              Alert.alert('Éxito', 'Producto eliminado correctamente');
            } catch (error: any) {
              console.error('❌ Error eliminando producto:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  // Eliminar categoría
  const handleEliminarCategoria = async (categoria: Categoria) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que quieres eliminar "${categoria.nombre}"?\nEsto no eliminará los productos en ella.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Eliminando categoría:', categoria.id_categoria);
              await categoriaService.delete(categoria.id_categoria);
              console.log('✅ Categoría eliminada exitosamente');
              
              // Actualizar la lista local
              setCategorias(
                categorias.filter(c => c.id_categoria !== categoria.id_categoria)
              );
              
              Alert.alert('Éxito', 'Categoría eliminada correctamente');
            } catch (error: any) {
              console.error('❌ Error eliminando categoría:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar la categoría');
            }
          }
        }
      ]
    );
  };

  // Mostrar el formulario en lugar de navegar
  const handleMostrarFormulario = () => {
    setMostrandoFormulario(true);
  };

  // Guardar la nueva categoría creada en el formulario
  const handleGuardarCategoria = async () => {
    const nombreLimpio = nuevoNombreCategoria.trim();
    if (!nombreLimpio) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío.");
      return;
    }

    try {
      console.log('💾 Guardando nueva categoría:', nombreLimpio);
      
      const nuevaCategoria = await categoriaService.create({
        nombre: nombreLimpio,  // Cambio: Era "NombreCategoria" → Ahora "nombre"
        color: categoriaService.getRandomColor()  // Cambio: Era "Color" → Ahora "color"
      });

      // Agregar a la lista local
      setCategorias([...categorias, nuevaCategoria]);
      
      // Limpiar formulario
      setMostrandoFormulario(false);
      setNuevoNombreCategoria("");
      
      Alert.alert("Éxito", "Categoría creada correctamente");
      console.log('✅ Categoría creada exitosamente');
      
    } catch (error: any) {
      console.error('❌ Error creando categoría:', error);
      Alert.alert("Error", error.message || "No se pudo crear la categoría");
    }

    
  };

  // --- LÓGICA DE RENDERIZADO ---

  if (authState.isLoading) {
    return (
      <View style={AppStyles.containers.page}>
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <Text style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>Verificando autenticación...</Text>
        </View>
      </View>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <View style={AppStyles.containers.page}>
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="account-alert" size={64} color="#ccc" />
          <Text style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>Necesitas iniciar sesión</Text>
          <Text style={[AppStyles.text.emptyStateSubtitle, { marginTop: AppStyles.spacing.md }]}>
            Ve a la sección de login para acceder a tus categorías
          </Text>
        </View>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={AppStyles.containers.page}>
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <Text style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>Cargando categorías...</Text>
        </View>
      </View>
    );
  }

  // SI SE SELECCIONÓ UN PRODUCTO, MUESTRA EL DETALLE
  if (productoSeleccionado) {
    return (
      <View style={AppStyles.containers.page}>
        <TouchableOpacity 
          style={AppStyles.misc.backButton}
          onPress={handleVolverALista}
        >
          <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
          <Text style={AppStyles.misc.backButtonText}>Volver a la lista</Text>
        </TouchableOpacity>

        <ScrollView style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', marginBottom: 30, gap: 15 }}>
            <MaterialCommunityIcons 
              name="package-variant" 
              size={48} 
              color={AppStyles.colors.primary} 
            />
            <Text style={AppStyles.text.detailTitle}>{productoSeleccionado.nombre}</Text>
          </View>

          <View style={[AppStyles.cards.base, { marginBottom: 20 }]}>
            <View style={AppStyles.containers.rowSpaceBetween}>
              <Text style={AppStyles.text.infoLabel}>Marca:</Text>
              <Text style={AppStyles.text.infoValue}>{productoSeleccionado.marca || 'No especificada'}</Text>
            </View>
            
            <View style={AppStyles.containers.rowSpaceBetween}>
              <Text style={AppStyles.text.infoLabel}>Modelo:</Text>
              <Text style={AppStyles.text.infoValue}>{productoSeleccionado.modelo || 'No especificado'}</Text>
            </View>
            
            <View style={AppStyles.containers.rowSpaceBetween}>
              <Text style={AppStyles.text.infoLabel}>Fecha de compra:</Text>
              <Text style={AppStyles.text.infoValue}>
                {productoSeleccionado.fecha_compra ? 
                  new Date(productoSeleccionado.fecha_compra).toLocaleDateString() : 
                  'No especificada'
                }
              </Text>
            </View>
            
            {productoSeleccionado.duracion_garantia_meses && (
              <View style={AppStyles.containers.rowSpaceBetween}>
                <Text style={AppStyles.text.infoLabel}>Garantía (meses):</Text>
                <Text style={AppStyles.text.infoValue}>{productoSeleccionado.duracion_garantia_meses}</Text>
              </View>
            )}
            
            {productoSeleccionado.categorias && productoSeleccionado.categorias.length > 0 && (
              <View style={AppStyles.containers.rowSpaceBetween}>
                <Text style={AppStyles.text.infoLabel}>Categorías:</Text>
                <Text style={AppStyles.text.infoValue}>
                  {productoSeleccionado.categorias.map(cat => cat.nombre).join(', ')}
                </Text>
              </View>
            )}

            {productoSeleccionado.tienda && (
              <View style={AppStyles.containers.rowSpaceBetween}>
                <Text style={AppStyles.text.infoLabel}>Tienda:</Text>
                <Text style={AppStyles.text.infoValue}>{productoSeleccionado.tienda}</Text>
              </View>
            )}
            
            {productoSeleccionado.notas && (
              <View style={AppStyles.containers.rowSpaceBetween}>
                <Text style={AppStyles.text.infoLabel}>Notas:</Text>
                <Text style={AppStyles.text.infoValue}>{productoSeleccionado.notas}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // SI SE SELECCIONÓ UNA CATEGORÍA, MUESTRA LA LISTA DE PRODUCTOS
  if (categoriaSeleccionada) {
    return (
      <View style={AppStyles.containers.page}>
        <TouchableOpacity style={AppStyles.misc.backButton} onPress={handleVolverACategorias}>
          <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
          <Text style={AppStyles.misc.backButtonText}>Volver a Categorías</Text>
        </TouchableOpacity>

        <ThemedText type="title" style={{ fontSize: 20, textAlign: "center", marginBottom: 24 }}>
          Productos en {categoriaSeleccionada.nombre}
        </ThemedText>

        {productosDeCategoria.length === 0 ? (
          <View style={AppStyles.containers.centered}>
            <MaterialCommunityIcons name="package-variant-closed" size={64} color="#ccc" />
            <Text style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>
              No hay productos en esta categoría
            </Text>
          </View>
        ) : (
          <ScrollView>
            {productosDeCategoria.map(producto => (
              <View key={producto.id_producto}>
                <TouchableOpacity 
                  style={[AppStyles.cards.interactive, { marginBottom: 10 }]} 
                  onPress={() => handleVerProducto(producto)}
                  testID={`tarjeta-producto-${producto.id_producto}`}
                >
                  <View style={AppStyles.containers.row}>
                    <MaterialCommunityIcons name="package-variant" size={24} color={AppStyles.colors.primary}/>
                    <Text style={AppStyles.text.cardTitle}>{producto.nombre}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={AppStyles.buttons.danger}
                  onPress={() => handleEliminarProducto(producto)}
                >
                  <Ionicons name="trash" size={20} color={AppStyles.colors.textLight} />
                  <Text style={[AppStyles.text.buttonText, { marginLeft: AppStyles.spacing.md }]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity 
              style={[AppStyles.buttons.secondary, { marginTop: 16, marginBottom: 20 }]}
              onPress={handleAgregarProducto}
            >
              <Ionicons name="add-circle-outline" size={24} color={AppStyles.colors.primary} />
              <Text style={[AppStyles.text.cardText, { color: AppStyles.colors.primary, marginLeft: AppStyles.spacing.md }]}>Agregar otro producto</Text>
            </TouchableOpacity>
         
          </ScrollView>
        )}
      </View>
    );
  }

  // VISTA PRINCIPAL: MUESTRA CATEGORÍAS Y EL FORMULARIO
  return (
    <View style={AppStyles.containers.page}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: "center", marginTop: 40, marginBottom: 24 }}>
        Tus Categorías
      </ThemedText>

      <ScrollView style={{ flex: 1 }}>
        {categorias.length === 0 ? (
          <View style={AppStyles.containers.centered}>
            <MaterialCommunityIcons name="shape-outline" size={64} color="#ccc" />
            <Text style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>
              Aún no has creado categorías
            </Text>
            <Text style={[AppStyles.text.emptyStateSubtitle, { marginTop: AppStyles.spacing.md }]}>
              Crea tu primera categoría para organizar tus productos
            </Text>
          </View>
        ) : (
          <View style={{ width: "100%", gap: 16, marginBottom: 24 }}>
            {categorias.map((categoria) => (
              <View key={categoria.id_categoria}>
                <TouchableOpacity
                  style={AppStyles.cards.interactive}
                  onPress={() => handleVerCategoria(categoria)}
                >
                  <View style={AppStyles.containers.row}>
                    <View style={[AppStyles.misc.colorIndicator, { backgroundColor: categoria.color }]} />
                    <MaterialCommunityIcons name="shape" size={32} color={AppStyles.colors.primary} />
                    <View style={{ flexDirection: "column" }}>
                      <Text style={AppStyles.text.cardTitle}>
                        {categoria.nombre}
                      </Text>
                      <Text style={AppStyles.text.cardSubtitle}>
                        Toca para ver productos
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleEliminarCategoria(categoria)}
                  style={AppStyles.buttons.danger}
                >
                  <Ionicons name="trash-outline" size={20} color={AppStyles.colors.textLight} />
                  <Text style={[AppStyles.text.buttonText, { marginLeft: AppStyles.spacing.md }]}>Eliminar Categoría</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        {/* MINI FORMULARIO Y BOTÓN PARA CREAR CATEGORÍA */}
        {mostrandoFormulario ? (
          <View style={[AppStyles.cards.base, { marginBottom: 20 }]}>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Nombre de la nueva categoría"
              value={nuevoNombreCategoria}
              onChangeText={setNuevoNombreCategoria}
            />
            <View style={AppStyles.containers.row}>
              <TouchableOpacity 
                style={[AppStyles.buttons.secondary, { flex: 1 }]}
                onPress={() => setMostrandoFormulario(false)}
              >
                <Text style={[AppStyles.text.cardText, { color: AppStyles.colors.primary, textAlign: 'center' }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[AppStyles.buttons.primary, { flex: 1, marginLeft: AppStyles.spacing.md }]}
                onPress={handleGuardarCategoria}
              >
                <Text style={[AppStyles.text.buttonText, { textAlign: 'center' }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={AppStyles.buttons.secondary} onPress={handleMostrarFormulario}>
            <Ionicons name="add-circle-outline" size={24} color={AppStyles.colors.primary} />
            <Text style={[AppStyles.text.cardText, { color: AppStyles.colors.primary, marginLeft: AppStyles.spacing.md }]}>Crear Nueva Categoría</Text>
          </TouchableOpacity>
        )}        
      </ScrollView>
       {/* BOTÓN DE AYUDA - TUTORIAL */}
      <TouchableOpacity
        style={AppStyles.buttons.fab}
        onPress={handleAbrirTutorial}
        >
          <Ionicons name="help" size={40} color={AppStyles.colors.textLight} />
        </TouchableOpacity>
    </View>
  );
};

export default Categorias;