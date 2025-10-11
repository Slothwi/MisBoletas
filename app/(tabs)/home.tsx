import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/hooks/useAuth';
import productoService, { Producto } from '../../src/services/ProductServiceSimplified';
import documentoService, { Documento } from '../../src/services/DocumentoService';

const Inicio = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);

  // Cargar productos del backend
  const cargarProductos = async () => {
    // Verificar autenticación antes de hacer la petición
    if (!authState.isAuthenticated) {
      console.log('❌ No se puede cargar productos: usuario no autenticado');
      setCargando(false);
      return;
    }

    try {
      console.log('📦 Cargando productos del servidor...');
      const productosDelServidor = await productoService.getAll();
      setProductos(productosDelServidor);
      console.log(`✅ ${productosDelServidor.length} productos cargados`);
    } catch (error: any) {
      console.error('❌ Error cargando productos:', error);
      Alert.alert(
        'Error', 
        'No se pudieron cargar los productos. Verifica tu conexión.',
        [
          { text: 'Reintentar', onPress: cargarProductos },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  // Cargar productos al inicializar
  useEffect(() => {
    // Solo cargar productos si está autenticado Y la verificación inicial ya terminó
    if (authState.isAuthenticated && !authState.isLoading) {
      cargarProductos();
    } else if (!authState.isLoading && !authState.isAuthenticated) {
      // Si ya terminó de verificar y no está autenticado, limpiar productos
      setProductos([]);
      setCargando(false);
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  // Cargar documentos cuando se selecciona un producto
  useEffect(() => {
    if (productoSeleccionado?.ProductoID) {
      cargarDocumentos(productoSeleccionado.ProductoID);
    } else {
      setDocumentos([]);
    }
  }, [productoSeleccionado]);

  // Función para refrescar
  const onRefresh = React.useCallback(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      setRefreshing(true);
      cargarProductos();
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  const handleAgregarProducto = () => {
    router.push('/formulario' as Href);
  };

  const handleVerProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  const handleVolverALista = () => {
    setProductoSeleccionado(null);
  };

  const handleEliminarProducto = async (producto: Producto) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${producto.NombreProducto}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (producto.ProductoID) {
                await productoService.delete(producto.ProductoID);
                Alert.alert('Éxito', 'Producto eliminado correctamente');
                cargarProductos(); // Recargar la lista
                handleVolverALista();
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  // Cargar documentos de un producto
  const cargarDocumentos = async (productoId: number) => {
    try {
      setCargandoDocumentos(true);
      console.log('📎 Cargando documentos del producto:', productoId);
      const docs = await documentoService.getByProducto(productoId);
      
      // DEBUG: Ver estructura de documentos
      if (docs.length > 0) {
        console.log('📄 Estructura del primer documento:', JSON.stringify(docs[0], null, 2));
      }
      
      setDocumentos(docs);
      console.log(`✅ ${docs.length} documentos cargados`);
    } catch (error) {
      console.error('❌ Error cargando documentos:', error);
      // No mostrar error al usuario si no hay documentos
      setDocumentos([]);
    } finally {
      setCargandoDocumentos(false);
    }
  };

  // Subir nuevo documento
  const handleSubirDocumento = async () => {
    if (!productoSeleccionado?.ProductoID) return;

    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Se requieren permisos para acceder a tus fotos y documentos'
        );
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Extraer nombre del archivo
        const uriParts = asset.uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        
        console.log('📎 Subiendo documento:', fileName);
        
        await documentoService.upload(
          productoSeleccionado.ProductoID,
          {
            uri: asset.uri,
            type: asset.type === 'image' ? 'image/jpeg' : undefined,
            name: fileName || 'documento.jpg',
          }
        );
        
        Alert.alert('Éxito', 'Documento subido correctamente');
        cargarDocumentos(productoSeleccionado.ProductoID);
      }
    } catch (error) {
      console.error('Error subiendo documento:', error);
      Alert.alert('Error', 'No se pudo subir el documento');
    }
  };

  // Eliminar documento
  const handleEliminarDocumento = async (documentoId: number | undefined) => {
    // Validar que el ID existe
    if (!documentoId) {
      Alert.alert('Error', 'ID de documento inválido');
      return;
    }

    Alert.alert(
      'Eliminar Documento',
      '¿Estás seguro de que quieres eliminar este documento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await documentoService.delete(documentoId);
              Alert.alert('Éxito', 'Documento eliminado correctamente');
              if (productoSeleccionado?.ProductoID) {
                cargarDocumentos(productoSeleccionado.ProductoID);
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el documento');
            }
          }
        }
      ]
    );
  };

  // Abrir documento en el navegador
  const handleVerDocumento = async (url: string) => {
    // Validar que la URL existe
    if (!url || url.trim() === '') {
      Alert.alert('Error', 'URL de documento no disponible');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir la URL');
      }
    } catch (error) {
      console.error('Error al abrir documento:', error);
      Alert.alert('Error', 'No se pudo abrir el documento');
    }
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <ThemedText type="title" style={styles.titulo}>
          Tus Productos
        </ThemedText>
        <View style={styles.centeredContainer}>
          <Text style={styles.cargandoTexto}>Cargando productos...</Text>
        </View>
      </View>
    );
  }

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

        <ScrollView 
          style={styles.detalleContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.detalleHeader}>
            <MaterialCommunityIcons 
              name="package-variant" 
              size={48} 
              color="#e77573" 
            />
            <Text style={styles.detalleTitulo}>{productoSeleccionado.NombreProducto}</Text>
          </View>

          <View style={styles.detalleInfo}>
            {productoSeleccionado.Marca && (
              <View key="marca" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Marca:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.Marca}</Text>
              </View>
            )}
            
            {productoSeleccionado.Modelo && (
              <View key="modelo" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modelo:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.Modelo}</Text>
              </View>
            )}
            
            {productoSeleccionado.FechaCompra && (
              <View key="fechaCompra" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha de compra:</Text>
                <Text style={styles.infoValue}>
                  {new Date(productoSeleccionado.FechaCompra).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {productoSeleccionado.DuracionGarantia && (
              <View key="garantia" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Garantía (días):</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.DuracionGarantia}</Text>
              </View>
            )}
            
            {productoSeleccionado.categorias && productoSeleccionado.categorias.length > 0 && (
              <View key="categorias" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categorías:</Text>
                <Text style={styles.infoValue}>
                  {productoSeleccionado.categorias.map(cat => cat.NombreCategoria).join(', ')}
                </Text>
              </View>
            )}

            {productoSeleccionado.Tienda && (
              <View key="tienda" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tienda:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.Tienda}</Text>
              </View>
            )}
            
            {productoSeleccionado.Notas && (
              <View key="notas" style={styles.infoRow}>
                <Text style={styles.infoLabel}>Notas:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.Notas}</Text>
              </View>
            )}
          </View>

          {/* Sección de Documentos */}
          <View style={styles.documentosSection}>
            <View style={styles.documentosHeader}>
              <Ionicons name="document-text" size={24} color="#e77573" />
              <Text style={styles.documentosTitulo}>Documentos</Text>
            </View>

            {cargandoDocumentos ? (
              <Text style={styles.cargandoTexto}>Cargando documentos...</Text>
            ) : documentos.length === 0 ? (
              <Text style={styles.noDocumentosTexto}>
                No hay documentos asociados a este producto
              </Text>
            ) : (
              <View style={styles.documentosList}>
                {documentos.map((doc, index) => {
                  // Manejar ambos formatos de ID (documentoid o DocumentoID)
                  const docId = doc.documentoid || doc.DocumentoID;
                  // Manejar ambos formatos de URL (url_gcs o URL_GCS)
                  const urlGCS = doc.url_gcs || doc.URL_GCS || '';
                  // Manejar ambos formatos de nombrearchivo
                  const nombreArchivo = doc.nombrearchivo || doc.NombreArchivo || 'Archivo';
                  // Manejar ambos formatos de content_type
                  const contentType = doc.content_type || doc.ContentType;
                  // Manejar ambos formatos de size_bytes
                  const sizeBytes = doc.size_bytes || doc.SizeBytes;
                  // Manejar ambos formatos de fecha_subida
                  const fechaSubida = doc.fecha_subida || doc.FechaSubida || new Date().toISOString();
                  
                  return (
                    <View key={docId || `doc-${index}`} style={styles.documentoItem}>
                      <View style={styles.documentoInfo}>
                        <Ionicons 
                          name={documentoService.isImage(contentType, nombreArchivo) ? "image" : "document"} 
                          size={24} 
                          color="#e77573" 
                        />
                        <View style={styles.documentoTexto}>
                          <Text style={styles.documentoNombre} numberOfLines={1}>
                            {nombreArchivo}
                          </Text>
                          <Text style={styles.documentoFecha}>
                            {new Date(fechaSubida).toLocaleDateString()} • {documentoService.formatFileSize(sizeBytes)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.documentoAcciones}>
                        <TouchableOpacity 
                          onPress={() => handleVerDocumento(urlGCS)}
                          style={styles.botonIcono}
                          disabled={!urlGCS}
                        >
                          <Ionicons name="eye" size={20} color={urlGCS ? "#4CAF50" : "#ccc"} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleEliminarDocumento(docId)}
                          style={styles.botonIcono}
                        >
                          <Ionicons name="trash" size={20} color="#f44336" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity 
              style={styles.botonSubirDocumento}
              onPress={handleSubirDocumento}
            >
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.botonSubirTexto}>Subir Documento</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.accionesContainer}>
            <TouchableOpacity 
              style={styles.botonEliminar}
              onPress={() => handleEliminarProducto(productoSeleccionado)}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.botonEliminarTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titulo}>
        Tus Productos
      </ThemedText>

      {/* Mostrar loading mientras se verifica autenticación */}
      {authState.isLoading ? (
        <View style={styles.sinProductosContainer}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <Text style={styles.sinProductosTexto}>
            Verificando autenticación...
          </Text>
        </View>
      ) : !authState.isAuthenticated ? (
        <View style={styles.sinProductosContainer}>
          <MaterialCommunityIcons name="account-alert" size={64} color="#ccc" />
          <Text style={styles.sinProductosTexto}>
            Necesitas iniciar sesión
          </Text>
          <Text style={styles.sinProductosSubtexto}>
            Ve a la sección de login para acceder a tus productos
          </Text>
        </View>
      ) : cargando ? (
        <View style={styles.sinProductosContainer}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <Text style={styles.sinProductosTexto}>
            Cargando productos...
          </Text>
        </View>
      ) : productos.length === 0 ? (
        <View style={styles.sinProductosContainer}>
          <MaterialCommunityIcons name="package-variant" size={64} color="#ccc" />
          <Text style={styles.sinProductosTexto}>
            Aún no has registrado productos
          </Text>
          <Text style={styles.sinProductosSubtexto}>
            Puedes añadirlos en la sección de agregar producto
          </Text>
          
          <TouchableOpacity 
            style={styles.botonAgregar} 
            onPress={handleAgregarProducto}
            testID='boton-agregar-producto'
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.botonAgregarTexto}>Agregar Producto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardsContainer}>
            {productos.map((producto) => (
              <TouchableOpacity 
                key={producto.ProductoID}
                style={styles.card}
                onPress={() => handleVerProducto(producto)}
                testID={`tarjeta-producto-${producto.ProductoID}`}
              >
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons 
                    name="package-variant" 
                    size={24} 
                    color="#e77573" 
                  />
                  <Text style={styles.cardText}>{producto.NombreProducto}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#e77573" />
              </TouchableOpacity>
            ))}
          </View>

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
};

// Los estilos se mantienen igual que en el código anterior
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a8cbf0',
    padding: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    fontSize: 16,
    color: '#666',
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '600',
  },
  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  botonVolverTexto: {
    color: '#e77573',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  detalleContainer: {
    flex: 1,
  },
  detalleHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  detalleTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 16,
    textAlign: 'center',
  },
  detalleInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#222',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  documentosSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  documentosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  documentosTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  noDocumentosTexto: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  documentosList: {
    gap: 12,
  },
  documentoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  documentoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  documentoTexto: {
    flex: 1,
  },
  documentoNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  documentoFecha: {
    fontSize: 12,
    color: '#666',
  },
  documentoAcciones: {
    flexDirection: 'row',
    gap: 12,
  },
  botonIcono: {
    padding: 8,
  },
  botonSubirDocumento: {
    backgroundColor: '#e77573',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  botonSubirTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  accionesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  sinProductosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sinProductosTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sinProductosSubtexto: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  botonAgregar: {
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  botonAgregarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  },
  botonAgregarSecundarioTexto: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Inicio;