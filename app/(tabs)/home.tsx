import { AppStyles, ThemedText } from "@/components";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Href, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import documentoService, { Documento } from '../../src/services/DocumentoService';
import productoService, { Producto } from '../../src/services/ProductServiceSimplified';

const Inicio = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);

  //Función para abrir URL externa (video tutorial).
  const handleAbrirTutorial = () => {
    Linking.openURL('https://www.youtube.com/@misBoletas-App');
  }

  // Cargar productos del backend
  const cargarProductos = useCallback(async () => {
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
  }, [authState.isAuthenticated]);

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
  }, [authState.isAuthenticated, authState.isLoading, cargarProductos]);

  // Cargar documentos cuando se selecciona un producto
  useEffect(() => {
    if (productoSeleccionado?.id_producto) {  // Cambio: Era "ProductoID" → Ahora "id_producto" (UUID)
      cargarDocumentos(productoSeleccionado.id_producto);
    } else {
      setDocumentos([]);
    }
  }, [productoSeleccionado]);

  // Función para refrescar
  const onRefresh = useCallback(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      setRefreshing(true);
      cargarProductos();
    }
  }, [authState.isAuthenticated, authState.isLoading, cargarProductos]);

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
      `¿Estás seguro de que quieres eliminar "${producto.nombre}"?`,  // Cambio: Era "NombreProducto" → Ahora "nombre"
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (producto.id_producto) {  // Cambio: Era "ProductoID" → Ahora "id_producto" (UUID)
                await productoService.delete(producto.id_producto);
                Alert.alert('Éxito', 'Producto eliminado correctamente');
                cargarProductos(); // Recargar la lista
                handleVolverALista();
              }
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  // FUNCIÓN PARA EDITAR UN PRODUCTO
const handleEditarProducto = (producto: Producto) => {
  // Verificar que el producto tiene ID
  if (!producto.id_producto) {
    Alert.alert('Error', 'No se puede editar este producto');
    return;
  }
  
  console.log('✏️ Editando producto:', producto.nombre);
  
  // Navegar al formulario con los datos del producto
  router.push({
    pathname: '/formulario' as Href,
    params: { 
      producto: JSON.stringify(producto),
      modoEdicion: 'true'
    }
  } as any );
};

  // Cargar documentos de un producto
  const cargarDocumentos = async (productoId: string) => {  // Cambio: Era "number" → Ahora "string" (UUID)
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

  // Subir nuevo documento (Imágenes o PDFs)
  const handleSubirDocumento = async () => {
    if (!productoSeleccionado?.id_producto) return;

    try {
      // Usar DocumentPicker para seleccionar cualquier tipo de archivo
      // Esto abre un selector que permite: imágenes, PDFs, documentos, etc.
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',  // Permite TODOS los tipos de archivo
        copyToCacheDirectory: true,  // Importante: copia a cache para leer
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name || asset.uri.split('/').pop() || 'documento';
        const mimeType = asset.mimeType || 'application/octet-stream';
        
        console.log('📎 Archivo seleccionado:', fileName);
        console.log('📝 Tipo MIME:', mimeType);
        
        await documentoService.upload(
          productoSeleccionado.id_producto,
          {
            uri: asset.uri,
            type: mimeType,
            name: fileName,
          }
        );
        
        Alert.alert('Éxito', 'Documento subido correctamente');
        cargarDocumentos(productoSeleccionado.id_producto);
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
              if (productoSeleccionado?.id_producto) {  // Cambio: Era "ProductoID" → Ahora "id_producto" (UUID)
                cargarDocumentos(productoSeleccionado.id_producto);
              }
            } catch {
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
      <View style={AppStyles.containers.page}>
        <ThemedText type="title" style={{ fontSize: 20, textAlign: 'center', marginTop: 40, marginBottom: 24 }}>
          Tus Productos
        </ThemedText>
        <View style={AppStyles.containers.centered}>
          <ThemedText style={AppStyles.misc.loadingText}>Cargando productos...</ThemedText>
        </View>
      </View>
    );
  }

  if (productoSeleccionado) {
    return (
      <View style={AppStyles.containers.page}>
        <TouchableOpacity 
          style={AppStyles.misc.backButton}
          onPress={handleVolverALista}
        >
          <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
          <ThemedText style={AppStyles.misc.backButtonText}>Volver a la lista</ThemedText>
        </TouchableOpacity>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: AppStyles.spacing.lg, paddingBottom: AppStyles.spacing.xl }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <MaterialCommunityIcons 
              name="package-variant" 
              size={48} 
              color={AppStyles.colors.primary} 
            />
            <ThemedText style={[AppStyles.text.detailTitle, { textAlign: 'center' }]}>{productoSeleccionado.nombre}</ThemedText>
          </View>

          <View style={[AppStyles.cards.base, { marginBottom: 20 }]}>
            {productoSeleccionado.marca && (
              <View key="marca" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Marca:</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>{productoSeleccionado.marca}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.modelo && (
              <View key="modelo" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Modelo:</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>{productoSeleccionado.modelo}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.fecha_compra && (
              <View key="fechaCompra" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Fecha de compra:</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>
                  {new Date(productoSeleccionado.fecha_compra).toLocaleDateString()}
                </ThemedText>
              </View>
            )}
            
            {productoSeleccionado.duracion_garantia_meses && (
              <View key="garantia" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Garantía (meses):</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>{productoSeleccionado.duracion_garantia_meses}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.categorias && productoSeleccionado.categorias.length > 0 && (
              <View key="categorias" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Categorías:</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>
                  {productoSeleccionado.categorias.map(cat => cat.nombre).join(', ')}
                </ThemedText>
              </View>
            )}

            {productoSeleccionado.tienda && (
              <View key="tienda" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Tienda:</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>{productoSeleccionado.tienda}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.notas && (
              <View key="notas" style={AppStyles.containers.rowSpaceBetween}>
                <ThemedText style={AppStyles.text.infoLabel}>Notas:</ThemedText>
                <ThemedText style={AppStyles.text.infoValue}>{productoSeleccionado.notas}</ThemedText>
              </View>
            )}
          </View>

          {/* Sección de Documentos */}
          <View style={[AppStyles.cards.base, { marginBottom: 20 }]}>
            <View style={AppStyles.containers.row}>
              <Ionicons name="document-text" size={24} color={AppStyles.colors.primary} />
              <ThemedText style={[AppStyles.text.cardTitle, { marginLeft: AppStyles.spacing.md }]}>Documentos</ThemedText>
            </View>

            {cargandoDocumentos ? (
              <ThemedText style={AppStyles.misc.loadingText}>Cargando documentos...</ThemedText>
            ) : documentos.length === 0 ? (
              <ThemedText style={{ fontSize: 14, color: '#888', textAlign: 'center', paddingVertical: 20, fontStyle: 'italic' }}>
                No hay documentos asociados a este producto
              </ThemedText>
            ) : (
              <View style={{ gap: 12, marginTop: 12 }}>
                {documentos.map((doc, index) => {
                  const docId = doc.documentoid || doc.DocumentoID;
                  const urlGCS = doc.url_gcs || doc.URL_GCS || '';
                  const nombreArchivo = doc.nombrearchivo || doc.NombreArchivo || 'Archivo';
                  const contentType = doc.content_type || doc.ContentType;
                  const sizeBytes = doc.size_bytes || doc.SizeBytes;
                  const fechaSubida = doc.fecha_subida || doc.FechaSubida || new Date().toISOString();
                  
                  return (
                    <View key={docId || `doc-${index}`} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                        <Ionicons 
                          name={documentoService.isImage(contentType, nombreArchivo) ? "image" : "document"} 
                          size={24} 
                          color={AppStyles.colors.primary} 
                        />
                        <View style={{ flex: 1 }}>
                          <ThemedText style={{ fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 4 }} numberOfLines={1}>
                            {nombreArchivo}
                          </ThemedText>
                          <ThemedText style={{ fontSize: 12, color: '#666' }}>
                            {new Date(fechaSubida).toLocaleDateString()} • {documentoService.formatFileSize(sizeBytes)}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity 
                          onPress={() => handleVerDocumento(urlGCS)}
                          style={{ padding: 8 }}
                          disabled={!urlGCS}
                        >
                          <Ionicons name="eye" size={20} color={urlGCS ? "#4CAF50" : "#ccc"} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleEliminarDocumento(docId)}
                          style={{ padding: 8 }}
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
              style={[AppStyles.buttons.primary, { marginTop: 16 }]}
              onPress={handleSubirDocumento}
            >
              <View style={AppStyles.containers.row}>
                <Ionicons name="cloud-upload" size={20} color={AppStyles.colors.textLight} />
                <ThemedText style={[AppStyles.text.buttonText, { marginLeft: AppStyles.spacing.md }]}>Subir Documento</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          <View style={AppStyles.cards.base}>
            {/* Boton de Editar */}
            <TouchableOpacity 
              style={[AppStyles.buttons.edit, { marginBottom: AppStyles.spacing.md }]}
              onPress={() => {handleEditarProducto(productoSeleccionado);}}
            >
              <Ionicons name="pencil-outline" size={20} color={AppStyles.colors.textLight} />
              <ThemedText style={AppStyles.text.buttonText}>Editar Producto</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={AppStyles.buttons.danger}
              onPress={() => handleEliminarProducto(productoSeleccionado)}
            >
              <Ionicons name="trash-outline" size={20} color={AppStyles.colors.textLight} />
              <ThemedText style={AppStyles.text.buttonText}>Eliminar</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={AppStyles.containers.page}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: 'center', marginTop: 40, marginBottom: 24 }}>
        Tus Productos
      </ThemedText>

      {/* Mostrar loading mientras se verifica autenticación */}
      {authState.isLoading ? (
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <ThemedText style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>
            Verificando autenticación...
          </ThemedText>
        </View>
      ) : !authState.isAuthenticated ? (
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="account-alert" size={64} color="#ccc" />
          <ThemedText style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>
            Necesitas iniciar sesión
          </ThemedText>
          <ThemedText style={[AppStyles.text.emptyStateSubtitle, { marginTop: AppStyles.spacing.md }]}>
            Ve a la sección de login para acceder a tus productos
          </ThemedText>
        </View>
      ) : cargando ? (
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <ThemedText style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>
            Cargando productos...
          </ThemedText>
        </View>
      ) : productos.length === 0 ? (
        <View style={AppStyles.containers.centered}>
          <MaterialCommunityIcons name="package-variant" size={64} color="#fff" />
          <ThemedText style={[AppStyles.text.emptyStateTitle, { marginTop: AppStyles.spacing.lg }]}>
            Aún no has registrado productos
          </ThemedText>
          <ThemedText style={[AppStyles.text.emptyStateSubtitle, { marginTop: AppStyles.spacing.md }]}>
            Puedes añadirlos en la sección de agregar producto
          </ThemedText>
          
          <TouchableOpacity 
            style={[AppStyles.buttons.primary, { marginTop: AppStyles.spacing.xl }]}
            onPress={handleAgregarProducto}
            testID='boton-agregar-producto'
          >
            <View style={AppStyles.containers.row}>
              <Ionicons name="add" size={24} color={AppStyles.colors.textLight} />
              <ThemedText style={[AppStyles.text.buttonText, { marginLeft: AppStyles.spacing.md }]}>Agregar Producto</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: AppStyles.spacing.lg }}>
          <View style={{ gap: 16, marginBottom: 24 }}>
            {productos.map((producto) => (
              <TouchableOpacity 
                key={producto.id_producto}
                style={AppStyles.cards.interactive}
                onPress={() => handleVerProducto(producto)}
                testID={`tarjeta-producto-${producto.id_producto}`}
              >
                <View style={AppStyles.containers.row}>
                  <MaterialCommunityIcons 
                    name="package-variant" 
                    size={24} 
                    color={AppStyles.colors.primary} 
                  />
                  <ThemedText style={AppStyles.text.cardText}>{producto.nombre}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[AppStyles.buttons.secondary, { marginBottom: 24 }]}
            onPress={handleAgregarProducto}
          >
            <Ionicons name="add-circle-outline" size={24} color={AppStyles.colors.primary} />
            <ThemedText style={[AppStyles.text.cardText, { color: AppStyles.colors.primary, marginLeft: AppStyles.spacing.md }]}>Agregar otro producto</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      )}

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

export default Inicio;