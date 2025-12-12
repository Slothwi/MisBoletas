import { ThemedText } from "@/src/components";
import { useAuth } from '@/src/hooks/useAuth';
import categoriaService, { Categoria } from '@/src/services/CategoriaServiceSimplified';
import documentoService from '@/src/services/DocumentoService';
import productoService from '@/src/services/ProductServiceSimplified';
// 👇 Importamos todo desde el tema
import { buttons, cards, colors, containers, inputs, misc, pickers, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

const SelectCategoria = (props: { 
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  onChange: (categoria: Categoria) => void;
  cargando: boolean;
}) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  if (props.cargando) {
    return (
      <View style={pickers.base}>
        <ThemedText style={text.helperText}>Cargando categorías...</ThemedText>
      </View>
    );
  }

  if (props.categorias.length === 0) {
    return (
      <View style={pickers.base}>
        <ThemedText style={text.helperText}>No hay categorías creadas</ThemedText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={pickers.base}
        onPress={() => setMostrarOpciones(!mostrarOpciones)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {props.categoriaSeleccionada && (
              <View 
                style={{ 
                  width: 12, height: 12, borderRadius: 6, 
                  backgroundColor: props.categoriaSeleccionada.color, marginRight: 8 
                }} 
              />
            )}
            <ThemedText style={{ fontSize: 16, color: props.categoriaSeleccionada ? colors.textDark : '#999' }}>
              {props.categoriaSeleccionada?.nombre || 'Seleccionar categoría...'}
            </ThemedText>
          </View>
          <Ionicons name={mostrarOpciones ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {mostrarOpciones && (
        <View style={pickers.optionsContainer}>
          <ScrollView style={pickers.optionsScroll}>
            {props.categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id_categoria}
                style={[
                  pickers.optionItem,
                  props.categoriaSeleccionada?.id_categoria === categoria.id_categoria && pickers.optionSelected
                ]}
                onPress={() => {
                  props.onChange(categoria);
                  setMostrarOpciones(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: categoria.color, marginRight: 10 }} />
                  <ThemedText style={[text.cardText, props.categoriaSeleccionada?.id_categoria === categoria.id_categoria && { color: colors.primary }]}>
                    {categoria.nombre}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const FormularioScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const params = useLocalSearchParams();
  
  // Estados del formulario
  const [nombreProducto, setNombreProducto] = useState('');
  const [fechaCompra, setFechaCompra] = useState<Date | null>(null);
  const [duracionGarantia, setDuracionGarantia] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [tienda, setTienda] = useState('');
  const [notas, setNotas] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{
    uri: string; name: string; type?: string; size?: number; tipoDocumento?: 'boleta' | 'garantia' | 'manual' | 'otro';
  } | null>(null);
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<any>(null);
  const MAX_LENGTH = 200;

  useEffect(() => {
    const modoEdicionStr = params.modoEdicion as string;
    const productoStr = params.producto as string;
    
    if (productoStr && modoEdicionStr === 'true') {
      try {
        const producto = JSON.parse(productoStr);
        setProductoEditando(producto);
        setModoEdicion(true);
        setNombreProducto(producto.nombre || '');
        setMarca(producto.marca || '');
        setModelo(producto.modelo || '');
        setTienda(producto.tienda || '');
        setNotas(producto.notas || '');
        
        if (producto.duracion_garantia_meses) setDuracionGarantia(producto.duracion_garantia_meses.toString());
        if (producto.fecha_compra) setFechaCompra(new Date(producto.fecha_compra));
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los datos del producto para editar.');
      }
    }
  }, [params.producto, params.modoEdicion]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setCargandoCategorias(true);
        const categoriasDelServidor = await categoriaService.getAll();
        setCategorias(categoriasDelServidor);
        
        if (productoEditando && productoEditando.categoria_ids && productoEditando.categoria_ids.length > 0) {
          const categoriaId = productoEditando.categoria_ids[0];
          const categoria = categoriasDelServidor.find(c => c.id_categoria === categoriaId);
          if (categoria) setCategoriaSeleccionada(categoria);
        }
      } catch (error) {
        setCategorias([]);
      } finally {
        setCargandoCategorias(false);
      }
    };

    if (authState.isAuthenticated) cargarCategorias();
  }, [authState.isAuthenticated, productoEditando]);

  const handleFileClick = async (tipoDocumento: 'boleta' | 'garantia' | 'manual') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setArchivoSeleccionado({
          uri: asset.uri,
          name: asset.name || 'documento',
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size,
          tipoDocumento: tipoDocumento,
        });
        Alert.alert('📎 Archivo seleccionado', 'Archivo listo para subir');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleGuardar = async () => {
    try {
      if (!nombreProducto.trim()) {
        Alert.alert('Error', 'El nombre del producto es requerido');
        return;
      }
      setIsLoading(true);

      const productoData = {
        nombre: nombreProducto.trim(),
        fecha_compra: fechaCompra ? fechaCompra.toISOString().split('T')[0] : undefined,
        duracion_garantia_meses: duracionGarantia ? parseInt(duracionGarantia) : undefined,
        marca: marca.trim() || undefined,
        modelo: modelo.trim() || undefined,
        tienda: tienda.trim() || undefined,
        notas: notas.trim() || undefined,
        categoria_ids: categoriaSeleccionada ? [categoriaSeleccionada.id_categoria] : [],
      };

      let productoGuardado;
      if (modoEdicion && productoEditando?.id_producto) {
        productoGuardado = await productoService.update(productoEditando.id_producto, productoData);
      } else {
        productoGuardado = await productoService.create(productoData);
      }

      // --- LOGICA OCR CORREGIDA ---
      if (archivoSeleccionado && productoGuardado.id_producto) {
        try {
          setIsProcessingOCR(true);
          setOcrStatus('Subiendo y analizando boleta...'); // Feedback visual
          
          const tipoDocumento = archivoSeleccionado.tipoDocumento || 'boleta';

          // 1. Subir y esperar análisis
          const { ocrData } = await documentoService.uploadAndWaitOCR(
            productoGuardado.id_producto,
            { uri: archivoSeleccionado.uri, type: archivoSeleccionado.type, name: archivoSeleccionado.name },
            tipoDocumento
          );

          // 2. [FIX] Verificar y GUARDAR datos del OCR
          if (tipoDocumento === 'boleta' && ocrData && ocrData.parsed_data) {
            const { comercio, fecha } = ocrData.parsed_data;
            const datosActualizar: any = {};
            let huboCambios = false;

            // Solo autocompletar si el usuario no escribió nada (para no sobrescribir)
            if (comercio && !tienda) {
                datosActualizar.tienda = comercio;
                huboCambios = true;
            }
            
            if (fecha && !fechaCompra) {
                try {
                  // Asumimos formato del regex: DD-MM-YYYY o DD/MM/YYYY
                  const partes = fecha.split(/[-/]/);
                  if (partes.length === 3) {
                      // Crear fecha (Mes es 0-indexado)
                      const fechaObj = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
                      if (!isNaN(fechaObj.getTime())) {
                          datosActualizar.fecha_compra = fechaObj.toISOString().split('T')[0];
                          huboCambios = true;
                      }
                    }
                } catch (e) { console.log('Error parseando fecha OCR', e); }
            }

             // 3. ACTUALIZAR BASE DE DATOS
            if (huboCambios) {
                console.log("🤖 OCR encontró datos, guardando...", datosActualizar);
                await productoService.update(productoGuardado.id_producto, datosActualizar);
                
                Alert.alert(
                  '✨ ¡Magia!',
                  `Hemos detectado datos en tu boleta:\n\nTienda: ${comercio || 'No detectada'}\nFecha: ${fecha || 'No detectada'}\n\nSe han guardado automáticamente.`
                );
            }
          }
        } catch (ocrError) {
          console.error('Error OCR:', ocrError);
          Alert.alert('Advertencia', 'El producto se guardó, pero hubo un problema analizando el documento.');
        }
      }

      Alert.alert(
        'Éxito', 
        'Producto guardado correctamente', 
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
      );

    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar el producto.');
    } finally {
      setIsLoading(false);
      setIsProcessingOCR(false);
      setOcrStatus('');
    }
  };

  return (
    <ScrollView style={containers.scrollPage}>
      <View style={containers.pageContent}>
        <TouchableOpacity style={misc.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <ThemedText style={misc.backButtonText}>Volver</ThemedText>
        </TouchableOpacity>
        
        <View style={cards.base}>
          <View style={inputs.container}>
            <ThemedText style={text.label}>{modoEdicion ? '✏️ Editar Producto' : 'Nombre Producto'}</ThemedText>
            <TextInput style={inputs.base} placeholder="Ingrese nombre" value={nombreProducto} onChangeText={setNombreProducto} />
          </View>
          
          <View style={inputs.container}>
            <ThemedText style={text.label}>Fecha de compra</ThemedText>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={{ position: 'relative' }}>
                <TextInput style={inputs.base} value={fechaCompra ? formatDate(fechaCompra) : ''} editable={false} placeholder="DD/MM/AAAA" />
                <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ position: 'absolute', right: 12, top: 14 }} />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={fechaCompra || new Date()} mode="date" display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                onChange={(event, selectedDate) => { setShowDatePicker(false); if (selectedDate) setFechaCompra(selectedDate); }}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Categoría</ThemedText>
            <SelectCategoria categorias={categorias} categoriaSeleccionada={categoriaSeleccionada} onChange={setCategoriaSeleccionada} cargando={cargandoCategorias} />
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Duración Garantía (Meses)</ThemedText>
            <TextInput 
                style={inputs.base} 
                value={duracionGarantia} 
                onChangeText={setDuracionGarantia} 
                placeholder="Ej: 12" 
                keyboardType="numeric"
            />
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Marca</ThemedText>
            <TextInput style={inputs.base} value={marca} onChangeText={setMarca} placeholder="Marca" />
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Tienda</ThemedText>
            <TextInput style={inputs.base} value={tienda} onChangeText={setTienda} placeholder="Tienda" />
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Documentos</ThemedText>
            
            <View style={{ marginBottom: spacing.md }}>
              <TouchableOpacity
                onPress={() => handleFileClick('boleta')}
                style={[
                  buttons.secondary,
                  archivoSeleccionado?.tipoDocumento === 'boleta' && { backgroundColor: '#e0e0e0' }
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="receipt-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                    <ThemedText style={text.buttonTextSmall}>
                    {archivoSeleccionado?.tipoDocumento === 'boleta' ? `✅ ${archivoSeleccionado.name}` : 'Subir Boleta (OCR)'}
                    </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Estado del OCR */}
          {isProcessingOCR && (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <ThemedText style={{ color: colors.primary, fontWeight: 'bold' }}>{ocrStatus}</ThemedText>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
            <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={() => router.back()} disabled={isLoading}>
              <ThemedText style={[text.buttonTextColorless, { color: colors.secondary}]}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleGuardar} disabled={isLoading || isProcessingOCR}>
              <ThemedText style={text.buttonText}>{isLoading ? 'Guardando...' : 'Guardar'}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default FormularioScreen;