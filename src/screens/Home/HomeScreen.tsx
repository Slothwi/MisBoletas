import { ThemedText, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import documentoService, { Documento } from '@/src/services/DocumentoService';
import productoService, { Producto } from '@/src/services/ProductServiceSimplified';
import { buttons, cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Href, useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

// Función auxiliar para calcular fechas (se mantiene igual)
const calcularTiempoRestante = (fechaCompra: string | undefined, duracionMeses: number | undefined) => {
  if (!fechaCompra || !duracionMeses) return { diasRestantes: -1, textoFormato: 'N/A', color: '#888' };
  try {
    const hoy = new Date();
    const compra = new Date(fechaCompra);
    const vencimiento = new Date(compra);
    vencimiento.setMonth(vencimiento.getMonth() + duracionMeses);
    const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    let textoFormato = '', color = '#888';
    if (diasRestantes < 0) { textoFormato = '⚠️ VENCIDO'; color = '#e74c3c'; }
    else if (diasRestantes === 0) { textoFormato = '🔴 VENCE HOY'; color = '#e74c3c'; }
    else if (diasRestantes === 1) { textoFormato = '🟠 VENCE MAÑANA'; color = '#f39c12'; }
    else if (diasRestantes <= 30) { textoFormato = `🟡 ${diasRestantes} días`; color = '#f1c40f'; }
    else { textoFormato = `🟢 ${diasRestantes} días`; color = '#27ae60'; } // Simplificado
    
    return { diasRestantes, textoFormato, color };
  } catch (e) { return { diasRestantes: -1, textoFormato: 'Error', color: '#888' }; }
};

const HomeScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const colorScheme = useColorScheme();
  
  // Colores dinámicos
  const cardBg = colorScheme === 'dark' ? colors.cardDark : colors.primaryLight;
  const iconColor = colorScheme === 'dark' ? '#fff' : colors.primary;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);

  const handleAbrirTutorial = () => { Linking.openURL('https://www.youtube.com/@misBoletas-App'); }

  const cargarProductos = useCallback(async () => {
    if (!authState.isAuthenticated) { setCargando(false); return; }
    try {
      const productosDelServidor = await productoService.getAll();
      setProductos(productosDelServidor);
    } catch (error: any) {
      console.error('Error cargando productos:', error);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  }, []); // ✅ ARREGLADO: Sin authState en deps - accede via closure

  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) cargarProductos();
    else if (!authState.isLoading && !authState.isAuthenticated) { setProductos([]); setCargando(false); }
  }, [authState.isAuthenticated, authState.isLoading]); // ✅ ARREGLADO: Removida cargarProductos de deps

  // Recargar productos cuando vuelves de otra pantalla (después de restaurar del historial o editar)
  useFocusEffect(
    useCallback(() => {
      if (authState.isAuthenticated) {
        cargarProductos();
        // Limpiar producto seleccionado para forzar recargar datos
        setProductoSeleccionado(null);
      }
    }, [authState.isAuthenticated, cargarProductos])
  );

  useEffect(() => {
    if (productoSeleccionado?.id_producto) cargarDocumentos(productoSeleccionado.id_producto);
    else setDocumentos([]);
  }, [productoSeleccionado]);

  const onRefresh = useCallback(() => {
    if (authState.isAuthenticated) { setRefreshing(true); cargarProductos(); }
  }, [authState.isAuthenticated, cargarProductos]);

  const handleAgregarProducto = () => router.push('/formulario' as Href);
  const handleVerProducto = (producto: Producto) => setProductoSeleccionado(producto);
  const handleVolverALista = () => setProductoSeleccionado(null);

  const handleEliminarProducto = async (producto: Producto) => {
    Alert.alert('Eliminar', `¿Borrar "${producto.nombre}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
            // ✅ OPTIMISTIC UPDATE: Remover inmediatamente de la UI
            setProductos(prev => prev.filter(p => p.id_producto !== producto.id_producto));
            handleVolverALista();
            
            try {
                if (producto.id_producto) {
                    await productoService.delete(producto.id_producto);
                    Toast.show({ type: 'success', text1: 'Producto eliminado' });
                    // No necesita cargarProductos() porque ya se eliminó de la UI
                }
            } catch (error) {
                // ✅ ROLLBACK: Si falla, volver a agregar
                Toast.show({ type: 'error', text1: 'No se pudo eliminar' });
                setProductos(prev => [...prev, producto]);
            }
        }}
    ]);
  };

  const handleEditarProducto = (producto: Producto) => {
    if (!producto.id_producto) return;
    router.push({ pathname: '/formulario' as Href, params: { producto: JSON.stringify(producto), modoEdicion: 'true' } } as any);
  };

  const cargarDocumentos = async (pid: string) => {
    try {
      setCargandoDocumentos(true);
      const docs = await documentoService.getByProducto(pid);
      setDocumentos(docs);
    } catch { setDocumentos([]); } finally { setCargandoDocumentos(false); }
  };

  const handleSubirDocumento = async () => {
    if (!productoSeleccionado?.id_producto) return;
    try {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            await documentoService.upload(productoSeleccionado.id_producto, { 
                uri: asset.uri, type: asset.mimeType || 'application/octet-stream', name: asset.name 
            });
            Toast.show({ type: 'success', text1: 'Documento subido' });
            cargarDocumentos(productoSeleccionado.id_producto);
        }
    } catch { Toast.show({ type: 'error', text1: 'Error al subir documento' }); }
  };

  const handleEliminarDocumento = async (id: number | undefined) => {
    if (!id) return;
    Alert.alert('Eliminar', '¿Borrar documento?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
            // ✅ OPTIMISTIC UPDATE: Remover inmediatamente
            const idStr = id.toString();
            const documentoEliminado = documentos.find(d => (d.documentoid === id) || (d.id_documento === idStr));
            setDocumentos(prev => prev.filter(d => (d.documentoid !== id && d.id_documento !== idStr)));
            
            try {
                await documentoService.delete(id);
                Toast.show({ type: 'success', text1: 'Documento eliminado' });
            } catch (error) {
                // ✅ ROLLBACK: Si falla, restaurar documento
                Toast.show({ type: 'error', text1: 'No se pudo eliminar' });
                if (documentoEliminado) setDocumentos(prev => [...prev, documentoEliminado]);
            }
        }}
    ]);
  };

  const handleVerDocumento = async (url: string) => {
    if (url && await Linking.canOpenURL(url)) await Linking.openURL(url);
    else Toast.show({ type: 'error', text1: 'No se puede abrir el documento' });
  };

  // --- VISTA: DETALLE PRODUCTO ---
  if (productoSeleccionado) {
    return (
      <ThemedView style={[containers.page, { backgroundColor: colorScheme === 'dark' ? colors.backgroundDark : colors.background }]}>
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleVolverALista} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
            {productoSeleccionado.nombre}
          </ThemedText>
        </View>

        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={[cards.base, { backgroundColor: cardBg }]}>
            {productoSeleccionado.marca && <View style={containers.rowSpaceBetween}><ThemedText style={text.infoLabel}>Marca:</ThemedText><ThemedText style={text.infoValue}>{productoSeleccionado.marca}</ThemedText></View>}
            {productoSeleccionado.modelo && <View style={containers.rowSpaceBetween}><ThemedText style={text.infoLabel}>Modelo:</ThemedText><ThemedText style={text.infoValue}>{productoSeleccionado.modelo}</ThemedText></View>}
            {productoSeleccionado.fecha_compra && <View style={containers.rowSpaceBetween}><ThemedText style={text.infoLabel}>Compra:</ThemedText><ThemedText style={text.infoValue}>{new Date(productoSeleccionado.fecha_compra).toLocaleDateString()}</ThemedText></View>}
            {productoSeleccionado.duracion_garantia_meses && (
                <View style={containers.rowSpaceBetween}>
                    <ThemedText style={text.infoLabel}>Estado:</ThemedText>
                    <ThemedText style={{ fontWeight: 'bold', color: calcularTiempoRestante(productoSeleccionado.fecha_compra, productoSeleccionado.duracion_garantia_meses).color }}>
                        {calcularTiempoRestante(productoSeleccionado.fecha_compra, productoSeleccionado.duracion_garantia_meses).textoFormato}
                    </ThemedText>
                </View>
            )}
            {productoSeleccionado.tienda && <View style={containers.rowSpaceBetween}><ThemedText style={text.infoLabel}>Tienda:</ThemedText><ThemedText style={text.infoValue}>{productoSeleccionado.tienda}</ThemedText></View>}
            {productoSeleccionado.notas && <View style={containers.rowSpaceBetween}><ThemedText style={text.infoLabel}>Notas:</ThemedText><ThemedText style={text.infoValue}>{productoSeleccionado.notas}</ThemedText></View>}
          </View>

          <View style={[cards.base, { backgroundColor: cardBg }]}>
            <View style={containers.row}><Ionicons name="document-text" size={24} color={colors.primary} /><ThemedText style={[text.cardTitle, { marginLeft: 10 }]}>Documentos</ThemedText></View>
            {cargandoDocumentos ? <ThemedText style={misc.loadingText}>Cargando...</ThemedText> : 
             documentos.length === 0 ? <View style={{ alignItems: 'center', marginTop: 10 }}><ThemedText style={{ fontStyle: 'italic', textAlign: 'center', color: '#888' }}>Sin documentos</ThemedText></View> : 
             (
                // ✅ ARREGLADO: FlatList para optimizar listas grandes de documentos
                <FlatList
                  data={documentos}
                  keyExtractor={(item) => item.id_documento || item.documentoid?.toString() || Math.random().toString()}
                  scrollEnabled={false} // No scroll anidado
                  removeClippedSubviews={true} // No renderizar items fuera de viewport
                  maxToRenderPerBatch={10} // Renderizar máximo 10 items por batch
                  updateCellsBatchingPeriod={50} // Esperar 50ms antes de siguiente batch
                  renderItem={({ item: doc }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colorScheme==='dark'?colors.cardDark:'#f8f9fa', padding: 10, borderRadius: 8, justifyContent: 'space-between', marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 }}>
                        <Ionicons name="document" size={24} color={colors.primary} />
                        <ThemedText style={{ flex: 1 }} numberOfLines={1}>{doc.nombrearchivo || doc.NombreArchivo || 'Archivo'}</ThemedText>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => handleVerDocumento(doc.url_gcs || doc.URL_GCS || '')}><Ionicons name="eye" size={20} color="#4CAF50" /></TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEliminarDocumento(doc.documentoid || doc.DocumentoID)}><Ionicons name="trash" size={20} color="#f44336" /></TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              )}
              <TouchableOpacity style={[buttons.primary, { marginTop: 15 }]} onPress={handleSubirDocumento}><ThemedText style={text.buttonText}>Subir Documento</ThemedText></TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[buttons.edit, { flex: 1 }]} onPress={() => handleEditarProducto(productoSeleccionado)}><ThemedText style={text.buttonText}>Editar</ThemedText></TouchableOpacity>
            <TouchableOpacity style={[buttons.danger, { flex: 1 }]} onPress={() => handleEliminarProducto(productoSeleccionado)}><ThemedText style={text.buttonText}>Eliminar</ThemedText></TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  // --- VISTA: LISTA PRINCIPAL (HOME) ---
  return (
    <ThemedView style={[containers.page, { backgroundColor: colorScheme === 'dark' ? colors.backgroundDark : colors.background }]}>
      <ThemedText style={text.detailTitle}>Tus Productos</ThemedText>

      {cargando ? (
        <View style={containers.centered}><ThemedText>Cargando...</ThemedText></View>
      ) : productos.length === 0 ? (
        <View style={containers.centered}>
            <MaterialCommunityIcons name="package-variant" size={64} color="#ccc" />
            <ThemedText style={{ marginTop: 20 }}>Aún no tienes productos</ThemedText>
            <TouchableOpacity style={[buttons.primary, { marginTop: 20 }]} onPress={handleAgregarProducto}>
                <ThemedText style={text.buttonText}>Agregar Producto</ThemedText>
            </TouchableOpacity>
        </View>
      ) : (
        <FlatList
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 80 }}
            data={productos}
            keyExtractor={(item) => item.id_producto}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => {
                const estado = calcularTiempoRestante(item.fecha_compra, item.duracion_garantia_meses);
                // Mostrar indicador de documentos si existe
                const tieneDocumentos = (item.numero_documentos ?? 0) > 0;
                const numDocs = String(item.numero_documentos || 0);
                const estadoTexto = String(estado.textoFormato || '');
                return (
                    <TouchableOpacity 
                        style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                        onPress={() => handleVerProducto(item)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <MaterialCommunityIcons name="package-variant" size={24} color={colors.primary} />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <ThemedText style={[text.cardText, { flexShrink: 1, color: colors.textDark }]} numberOfLines={1}>{String(item.nombre || '')}</ThemedText>
                                    {tieneDocumentos && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, backgroundColor: colors.secondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                            <Ionicons name="document" size={12} color="#fff" />
                                            <ThemedText style={{ fontSize: 10, color: '#fff', marginLeft: 3, fontWeight: 'bold' }}>{numDocs}</ThemedText>
                                        </View>
                                    )}
                                </View>
                                <ThemedText style={{ fontSize: 12, color: estado.color, fontWeight: 'bold', marginTop: 4 }}>{estadoTexto}</ThemedText>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={iconColor} />
                    </TouchableOpacity>
                );
            }}
            ListFooterComponent={
                <TouchableOpacity style={[buttons.secondary, { marginTop: 20 }]} onPress={handleAgregarProducto}>
                    <ThemedText style={{ color: colors.primary, textAlign: 'center', fontWeight: 'bold' }}>+ Agregar otro</ThemedText>
                </TouchableOpacity>
            }
        />
      )}
      <TouchableOpacity style={buttons.fab} onPress={handleAbrirTutorial}>
          <Ionicons name="help" size={30} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default HomeScreen;