import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
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

  // Función para navegar al formulario
  const handleAgregarProducto = () => {
    // Navegar al formulario usando type assertion
    router.push('./formulario');
  };

  // Cargar categorías del backend
  const cargarCategorias = async () => {
    if (!authState.isAuthenticated) {
      console.log('❌ No se puede cargar categorías: usuario no autenticado');
      setCargando(false);
      return;
    }

    try {
      console.log('📂 Cargando categorías del servidor...');
      console.log('🔐 Usuario autenticado:', authState.user?.correo);
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
  };

  // Cargar categorías al inicializar
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      cargarCategorias();
    } else if (!authState.isLoading && !authState.isAuthenticated) {
      setCategorias([]);
      setCargando(false);
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  // Obtener productos por categoría
  const obtenerProductosPorCategoria = async (categoriaId: string) => {  // Cambio: Era "number" → Ahora "string" (UUID)
    try {
      console.log(`📦 Cargando productos de categoría ${categoriaId}...`);
      const todosLosProductos = await productoService.getAll();
      
      // NOTA: El backend no devuelve categorías en cada producto aún.
      // Por ahora, mostrar todos los productos del usuario
      // TODO: Implementar endpoint GET /productos?categoria={id} en el backend
      setProductosDeCategoria(todosLosProductos);
      console.log(`✅ ${todosLosProductos.length} productos encontrados`);
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
      <View style={styles.container}>
        <View style={styles.sinCategoriasContainer}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <Text style={styles.sinCategoriasTexto}>Verificando autenticación...</Text>
        </View>
      </View>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.sinCategoriasContainer}>
          <MaterialCommunityIcons name="account-alert" size={64} color="#ccc" />
          <Text style={styles.sinCategoriasTexto}>Necesitas iniciar sesión</Text>
          <Text style={styles.sinCategoriasSubtexto}>
            Ve a la sección de login para acceder a tus categorías
          </Text>
        </View>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.container}>
        <View style={styles.sinCategoriasContainer}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <Text style={styles.sinCategoriasTexto}>Cargando categorías...</Text>
        </View>
      </View>
    );
  }

  // SI SE SELECCIONÓ UN PRODUCTO, MUESTRA EL DETALLE
  if (productoSeleccionado) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.botonVolver}
          onPress={handleVolverALista}
        >
          <Ionicons name="arrow-back" size={24} color="#e77573" />
          <Text style={styles.botonVolverTexto}>Volver a la lista</Text>
        </TouchableOpacity>

        <ScrollView style={styles.detalleContainer}>
          <View style={styles.detalleHeader}>
            <MaterialCommunityIcons 
              name="package-variant" 
              size={48} 
              color="#e77573" 
            />
            <Text style={styles.detalleTitulo}>{productoSeleccionado.NombreProducto}</Text>
          </View>

          <View style={styles.detalleInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marca:</Text>
              <Text style={styles.infoValue}>{productoSeleccionado.Marca || 'No especificada'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Modelo:</Text>
              <Text style={styles.infoValue}>{productoSeleccionado.Modelo || 'No especificado'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de compra:</Text>
              <Text style={styles.infoValue}>
                {productoSeleccionado.FechaCompra ? 
                  new Date(productoSeleccionado.FechaCompra).toLocaleDateString() : 
                  'No especificada'
                }
              </Text>
            </View>
            
            {productoSeleccionado.DuracionGarantia && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Garantía (días):</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.DuracionGarantia}</Text>
              </View>
            )}
            
            {productoSeleccionado.categorias && productoSeleccionado.categorias.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categorías:</Text>
                <Text style={styles.infoValue}>
                  {productoSeleccionado.categorias.map(cat => cat.NombreCategoria).join(', ')}
                </Text>
              </View>
            )}

            {productoSeleccionado.Tienda && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tienda:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.Tienda}</Text>
              </View>
            )}
            
            {productoSeleccionado.Notas && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Notas:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.Notas}</Text>
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
      <View style={styles.container}>
        <TouchableOpacity style={styles.botonVolver} onPress={handleVolverACategorias}>
          <Ionicons name="arrow-back" size={24} color="#e77573" />
          <Text style={styles.botonVolverTexto}>Volver a Categorías</Text>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.titulo}>
          Productos en {categoriaSeleccionada.nombre}  {/* Cambio: Era "NombreCategoria" → Ahora "nombre" */}
        </ThemedText>

        {productosDeCategoria.length === 0 ? (
          <View style={styles.sinCategoriasContainer}>
            <MaterialCommunityIcons name="package-variant-closed" size={64} color="#ccc" />
            <Text style={styles.sinCategoriasTexto}>
              No hay productos en esta categoría
            </Text>
          </View>
        ) : (
          <ScrollView>
            {productosDeCategoria.map(producto => (
              <TouchableOpacity 
                key={producto.id_producto}
                style={styles.cardProducto} 
                onPress={() => handleVerProducto(producto)}
                testID={`tarjeta-producto-${producto.id_producto}`}
              >
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons name="package-variant" size={24} color="#e77573"/>
                  <Text style={styles.cardTitle}>{producto.nombre}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </TouchableOpacity>
            ))}
            {/* BOTÓN PARA ELIMINAR PRODUCTO DENTRO DE UNA CATEGORIA - AÚN NO FUNCIONAL*/}
            <TouchableOpacity 
              style={styles.botonEliminar}
              onPress={() => {}}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.botonEliminarTexto}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botonAgregarSecundario}
              onPress={handleAgregarProducto}
            >
              <Ionicons name="add-circle-outline" size={24} color="#e77573" />
              <Text style={styles.botonAgregarSecundarioTexto}>Agregar otro producto</Text>
            </TouchableOpacity>
         
          </ScrollView>
        )}
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
        {categorias.length === 0 ? (
          <View style={styles.sinCategoriasContainer}>
            <MaterialCommunityIcons name="shape-outline" size={64} color="#ccc" />
            <Text style={styles.sinCategoriasTexto}>
              Aún no has creado categorías
            </Text>
            <Text style={styles.sinCategoriasSubtexto}>
              Crea tu primera categoría para organizar tus productos
            </Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {categorias.map((categoria) => (
              // Cambio: Era "CategoriaID" → Ahora "id_categoria" (UUID)
              <TouchableOpacity
                key={categoria.id_categoria}
                style={styles.card}
                onPress={() => handleVerCategoria(categoria)}
              >
                <View style={styles.cardContent}>
                  {/* Cambio: Era "Color" → Ahora "color" */}
                  <View style={[styles.colorIndicator, { backgroundColor: categoria.color }]} />
                  <MaterialCommunityIcons name="shape" size={32} color="#e77573" />
                  <View style={styles.cardTextContainer}>
                    {/* Cambio: Era "NombreCategoria" → Ahora "nombre" */}
                    <Text style={styles.cardTitle}>
                      {categoria.nombre}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Toca para ver productos
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#e77573" />
              </TouchableOpacity>
              
            ))}
            {/* BOTÓN PARA ELIMINAR CATEGORÍA - AÚN NO FUNCIONAL */}
            <TouchableOpacity 
          onPress={() => {}}
          style={styles.botonEliminar}
        >
          <Text style={styles.botonEliminarTexto}>Eliminar Categoría</Text>
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
          </View>
        )}
        
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
                onPress={() => setMostrandoFormulario(false)}
              >
                <Text style={styles.botonFormTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.botonForm, styles.botonGuardar]} 
                onPress={handleGuardarCategoria}
              >
                <Text style={[styles.botonFormTexto, { color: '#fff' }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.botonAgregar} onPress={handleMostrarFormulario}>
            <Ionicons name="add-circle-outline" size={24} color="#e77573" />
            <Text style={styles.botonAgregarTexto}>Crear Nueva Categoría</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a8cbf0", padding: 24 },
  scrollContainer: { flex: 1 },
  titulo: { fontSize: 20, textAlign: "center", marginTop: 40, marginBottom: 24 },
  cardsContainer: { width: "100%", gap: 16, marginBottom: 24 },
  card: { backgroundColor: "#ffffff", flexDirection: "row", alignItems: "center", 
    justifyContent: "space-between", padding: 20, borderRadius: 12, elevation: 2, 
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  cardContent: { flexDirection: "row", alignItems: "center", gap: 15 },
  cardTextContainer: { flexDirection: "column" },
  cardTitle: { color: "#222", fontSize: 18, fontWeight: "600" },
  cardSubtitle: { color: "#666", fontSize: 14 },
  colorIndicator: { width: 16, height: 16, borderRadius: 8, marginRight: 8 },
  botonAgregar: { flexDirection: "row", alignItems: "center", justifyContent: "center", 
    paddingVertical: 16, borderRadius: 8, gap: 8, borderWidth: 1, borderColor: "#e77573", 
    backgroundColor: "#fff" },
  botonAgregarTexto: { color: "#222", fontSize: 16, fontWeight: "600" },
  botonVolver: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  botonVolverTexto: { color: '#e77573', fontSize: 16, marginLeft: 8, fontWeight: '600' },
  cardProducto: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
     justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 10 },
  formularioContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, 
    marginTop: 10, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, 
    fontSize: 16, marginBottom: 15 },
  botonesFormulario: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  botonForm: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  botonCancelar: { backgroundColor: '#f0f0f0' },
  botonGuardar: { backgroundColor: '#e77573' },
  botonFormTexto: { fontWeight: '600', fontSize: 16 },
  detalleContainer: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 12, padding: 20 },
  detalleHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  detalleTitulo: { fontSize: 24, fontWeight: 'bold', color: '#222', marginTop: 16, 
     textAlign: 'center'},
  detalleInfo: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20},
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, 
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  infoLabel: { fontSize: 16, fontWeight: '600', color: '#666'},
  infoValue: { fontSize: 16, color: '#222', textAlign: 'right', flex: 1, marginLeft: 10},
  sinCategoriasContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sinCategoriasTexto: { fontSize: 18, color: '#666', marginTop: 16, textAlign: 'center' },
  sinCategoriasSubtexto: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
   // NUEVO: Estilos para el botón agregar secundario
  botonAgregarSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e77573',
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 20,
  },
  botonAgregarSecundarioTexto: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  botonEliminar: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  botonEliminarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Categorias;