import { ThemedText } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import documentoService, { Documento } from '@/src/services/DocumentoService';
import productoService, { Producto } from '@/src/services/ProductServiceSimplified';
import { buttons, cards, colors, containers, misc, spacing, text } from '@/src/theme'; // Importamos el nuevo tema
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Href, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

// Función auxiliar para calcular fechas
const calcularTiempoRestante = (
  fechaCompra: string | undefined,
  duracionMeses: number | undefined
): { diasRestantes: number; textoFormato: string; color: string } => {
  if (!fechaCompra || !duracionMeses) {
    return { diasRestantes: -1, textoFormato: 'N/A', color: '#888' };
  }

  try {
    const hoy = new Date();
    const compra = new Date(fechaCompra);
    const vencimiento = new Date(compra);
    vencimiento.setMonth(vencimiento.getMonth() + duracionMeses);

    const diasRestantes = Math.ceil(
      (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    let textoFormato = '';
    let color = '#888';

    if (diasRestantes < 0) {
      textoFormato = '⚠️ VENCIDO';
      color = '#e74c3c';
    } else if (diasRestantes === 0) {
      textoFormato = '🔴 VENCE HOY';
      color = '#e74c3c';
    } else if (diasRestantes === 1) {
      textoFormato = '🟠 VENCE MAÑANA';
      color = '#f39c12';
    } else if (diasRestantes <= 7) {
      textoFormato = `🟠 ${diasRestantes} días`;
      color = '#f39c12';
    } else if (diasRestantes <= 30) {
      textoFormato = `🟡 ${diasRestantes} días`;
      color = '#f1c40f';
    } else if (diasRestantes <= 365) {
      const meses = Math.floor(diasRestantes / 30);
      textoFormato = `🟢 ${meses} mes${meses > 1 ? 'es' : ''}`;
      color = '#27ae60';
    } else {
      const años = Math.floor(diasRestantes / 365);
      const mesesResto = Math.floor((diasRestantes % 365) / 30);
      if (mesesResto > 0) {
        textoFormato = `🟢 ${años} año${años > 1 ? 's' : ''} ${mesesResto} mes${mesesResto > 1 ? 'es' : ''}`;
      } else {
        textoFormato = `🟢 ${años} año${años > 1 ? 's' : ''}`;
      }
      color = '#27ae60';
    }

    return { diasRestantes, textoFormato, color };
  } catch (error) {
    return { diasRestantes: -1, textoFormato: 'Error', color: '#888' };
  }
};

const HomeScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);

  const handleAbrirTutorial = () => {
    Linking.openURL('https://www.youtube.com/@misBoletas-App');
  }

  const cargarProductos = useCallback(async () => {
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

  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      cargarProductos();
    } else if (!authState.isLoading && !authState.isAuthenticated) {
      setProductos([]);
      setCargando(false);
    }
  }, [authState.isAuthenticated, authState.isLoading, cargarProductos]);

  useEffect(() => {
    if (productoSeleccionado?.id_producto) {
      cargarDocumentos(productoSeleccionado.id_producto);
    } else {
      setDocumentos([]);
    }
  }, [productoSeleccionado]);

  const onRefresh = useCallback(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      setRefreshing(true);
      cargarProductos();
    }
  }, [authState.isAuthenticated, authState.isLoading, cargarProductos]);

  const handleAgregarProducto = useCallback(() => {
    router.push('/formulario' as Href);
  }, [router]);

  const handleVerProducto = useCallback((producto: Producto) => {
    setProductoSeleccionado(producto);
  }, []);

  const handleVolverALista = useCallback(() => {
    setProductoSeleccionado(null);
  }, []);

  const handleEliminarProducto = useCallback(async (producto: Producto) => {
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
              if (producto.id_producto) {
                await productoService.delete(producto.id_producto);
                Alert.alert('Éxito', 'Producto eliminado correctamente');
                cargarProductos();
                handleVolverALista();
              }
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  }, [cargarProductos, handleVolverALista]);

  const handleEditarProducto = useCallback((producto: Producto) => {
    if (!producto.id_producto) {
      Alert.alert('Error', 'No se puede editar este producto');
      return;
    }
    
    router.push({
      pathname: '/formulario' as Href,
      params: { 
        producto: JSON.stringify(producto),
        modoEdicion: 'true'
      }
    } as any );
  }, [router]);

  const cargarDocumentos = async (productoId: string) => {
    try {
      setCargandoDocumentos(true);
      console.log('📎 Cargando documentos del producto:', productoId);
      const docs = await documentoService.getByProducto(productoId);
      
      setDocumentos(docs);
      console.log(`✅ ${docs.length} documentos cargados`);
    } catch (error) {
      console.error('❌ Error cargando documentos:', error);
      setDocumentos([]);
    } finally {
      setCargandoDocumentos(false);
    }
  };

  const handleSubirDocumento = async () => {
    if (!productoSeleccionado?.id_producto) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name || asset.uri.split('/').pop() || 'documento';
        const mimeType = asset.mimeType || 'application/octet-stream';
        
        console.log('📎 Archivo seleccionado:', fileName);
        
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

  const handleEliminarDocumento = async (documentoId: number | undefined) => {
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
              if (productoSeleccionado?.id_producto) {
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

  const handleVerDocumento = async (url: string) => {
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

  // VISTA DE CARGA
  if (cargando) {
    return (
      <View style={containers.page}>
        <ThemedText type="title" style={{ fontSize: 20, textAlign: 'center', marginTop: 40, marginBottom: 24 }}>
          Tus Productos
        </ThemedText>
        <View style={containers.centered}>
          <ThemedText style={misc.loadingText}>Cargando productos...</ThemedText>
        </View>
      </View>
    );
  }

  // VISTA DETALLE PRODUCTO
  if (productoSeleccionado) {
    return (
      <View style={containers.page}>
        <TouchableOpacity 
          style={misc.backButton}
          onPress={handleVolverALista}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <ThemedText style={misc.backButtonText}>Volver a la lista</ThemedText>
        </TouchableOpacity>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <MaterialCommunityIcons 
              name="package-variant" 
              size={48} 
              color={colors.primary} 
            />
            <ThemedText style={[text.detailTitle, { textAlign: 'center' }]}>{productoSeleccionado.nombre}</ThemedText>
          </View>

          <View style={[cards.base, { marginBottom: 20 }]}>
            {productoSeleccionado.marca && (
              <View key="marca" style={containers.rowSpaceBetween}>
                <ThemedText style={text.infoLabel}>Marca:</ThemedText>
                <ThemedText style={text.infoValue}>{productoSeleccionado.marca}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.modelo && (
              <View key="modelo" style={containers.rowSpaceBetween}>
                <ThemedText style={text.infoLabel}>Modelo:</ThemedText>
                <ThemedText style={text.infoValue}>{productoSeleccionado.modelo}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.fecha_compra && (
              <View key="fechaCompra" style={containers.rowSpaceBetween}>
                <ThemedText style={text.infoLabel}>Fecha de compra:</ThemedText>
                <ThemedText style={text.infoValue}>
                  {new Date(productoSeleccionado.fecha_compra).toLocaleDateString()}
                </ThemedText>
              </View>
            )}
            
            {productoSeleccionado.duracion_garantia_meses && (
              <>
                <View key="garantia" style={containers.rowSpaceBetween}>
                  <ThemedText style={text.infoLabel}>Garantía (meses):</ThemedText>
                  <ThemedText style={text.infoValue}>{productoSeleccionado.duracion_garantia_meses}</ThemedText>
                </View>
                <View key="tiempoRestante" style={containers.rowSpaceBetween}>
                  <ThemedText style={text.infoLabel}>Te quedan:</ThemedText>
                  <ThemedText
                    style={[
                      text.infoValue,
                      {
                        color: calcularTiempoRestante(
                          productoSeleccionado.fecha_compra,
                          productoSeleccionado.duracion_garantia_meses
                        ).color,
                        fontWeight: 'bold',
                      },
                    ]}
                  >
                    {
                      calcularTiempoRestante(
                        productoSeleccionado.fecha_compra,
                        productoSeleccionado.duracion_garantia_meses
                      ).textoFormato
                    }
                  </ThemedText>
                </View>
              </>
            )}
            
            {productoSeleccionado.categorias && productoSeleccionado.categorias.length > 0 && (
              <View key="categorias" style={containers.rowSpaceBetween}>
                <ThemedText style={text.infoLabel}>Categorías:</ThemedText>
                <ThemedText style={text.infoValue}>
                  {productoSeleccionado.categorias.map(cat => cat.nombre).join(', ')}
                </ThemedText>
              </View>
            )}

            {productoSeleccionado.tienda && (
              <View key="tienda" style={containers.rowSpaceBetween}>
                <ThemedText style={text.infoLabel}>Tienda:</ThemedText>
                <ThemedText style={text.infoValue}>{productoSeleccionado.tienda}</ThemedText>
              </View>
            )}
            
            {productoSeleccionado.notas && (
              <View key="notas" style={containers.rowSpaceBetween}>
                <ThemedText style={text.infoLabel}>Notas:</ThemedText>
                <ThemedText style={text.infoValue}>{productoSeleccionado.notas}</ThemedText>
              </View>
            )}
          </View>

          {/* Sección de Documentos */}
          <View style={[cards.base, { marginBottom: 20 }]}>
            <View style={containers.row}>
              <Ionicons name="document-text" size={24} color={colors.primary} />
              <ThemedText style={[text.cardTitle, { marginLeft: spacing.md }]}>Documentos</ThemedText>
            </View>

            {cargandoDocumentos ? (
              <ThemedText style={misc.loadingText}>Cargando documentos...</ThemedText>
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
                          color={colors.primary} 
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
              style={[buttons.primary, { marginTop: 16 }]}
              onPress={handleSubirDocumento}
            >
              <View style={containers.row}>
                <Ionicons name="cloud-upload" size={20} color={colors.textLight} />
                <ThemedText style={[text.buttonText, { marginLeft: spacing.md }]}>Subir Documento</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          <View style={cards.base}>
            <TouchableOpacity 
              style={[buttons.edit, { marginBottom: spacing.md }]}
              onPress={() => {handleEditarProducto(productoSeleccionado);}}
            >
              <Ionicons name="pencil-outline" size={20} color={colors.textLight} />
              <ThemedText style={text.buttonText}>Editar Producto</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={buttons.danger}
              onPress={() => handleEliminarProducto(productoSeleccionado)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.textLight} />
              <ThemedText style={text.buttonText}>Eliminar</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // VISTA LISTA DE PRODUCTOS (MAIN)
  return (
    <View style={containers.page}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: 'center', marginTop: 40, marginBottom: 24 }}>
        Tus Productos
      </ThemedText>

      {authState.isLoading ? (
        <View style={containers.centered}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <ThemedText style={[text.emptyStateTitle, { marginTop: spacing.lg }]}>
            Verificando autenticación...
          </ThemedText>
        </View>
      ) : !authState.isAuthenticated ? (
        <View style={containers.centered}>
          <MaterialCommunityIcons name="account-alert" size={64} color="#ccc" />
          <ThemedText style={[text.emptyStateTitle, { marginTop: spacing.lg }]}>
            Necesitas iniciar sesión
          </ThemedText>
          <ThemedText style={[text.emptyStateSubtitle, { marginTop: spacing.md }]}>
            Ve a la sección de login para acceder a tus productos
          </ThemedText>
        </View>
      ) : cargando ? (
        <View style={containers.centered}>
          <MaterialCommunityIcons name="loading" size={64} color="#ccc" />
          <ThemedText style={[text.emptyStateTitle, { marginTop: spacing.lg }]}>
            Cargando productos...
          </ThemedText>
        </View>
      ) : productos.length === 0 ? (
        <View style={containers.centered}>
          <MaterialCommunityIcons name="package-variant" size={64} color="#fff" />
          <ThemedText style={[text.emptyStateTitle, { marginTop: spacing.lg }]}>
            Aún no has registrado productos
          </ThemedText>
          <ThemedText style={[text.emptyStateSubtitle, { marginTop: spacing.md }]}>
            Puedes añadirlos en la sección de agregar producto
          </ThemedText>
          
          <TouchableOpacity 
            style={[buttons.primary, { marginTop: spacing.xl }]}
            onPress={handleAgregarProducto}
            testID='boton-agregar-producto'
          >
            <View style={containers.row}>
              <Ionicons name="add" size={24} color={colors.textLight} />
              <ThemedText style={[text.buttonText, { marginLeft: spacing.md }]}>Agregar Producto</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList 
          style={{ flex: 1, paddingHorizontal: spacing.lg }}
          data={productos}
          keyExtractor={(item) => item.id_producto}
          renderItem={({ item: producto }) => (
            <TouchableOpacity 
              key={producto.id_producto}
              style={cards.interactive}
              onPress={() => handleVerProducto(producto)}
              testID={`tarjeta-producto-${producto.id_producto}`}
            >
              <View style={containers.row}>
                <MaterialCommunityIcons 
                  name="package-variant" 
                  size={24} 
                  color={colors.primary} 
                />
                <ThemedText style={text.cardText}>{producto.nombre}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={{ gap: 16 }} />
          }
          ListFooterComponent={
            <TouchableOpacity 
              style={[buttons.secondary, { marginBottom: 24 }]}
              onPress={handleAgregarProducto}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <ThemedText style={[text.cardText, { color: colors.primary, marginLeft: spacing.md }]}>Agregar otro producto</ThemedText>
            </TouchableOpacity>
          }
          contentContainerStyle={{ gap: 16, marginBottom: 24 }}
        />
      )}

      <TouchableOpacity
        style={buttons.fab}
        onPress={handleAbrirTutorial}
        >
          <Ionicons name="help" size={40} color={colors.textLight} />
        </TouchableOpacity>

    </View>
  );
};

export default HomeScreen;