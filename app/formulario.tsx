import { AppStyles, ThemedText } from "@/components";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import categoriaService, { Categoria } from '../src/services/CategoriaServiceSimplified';
import documentoService from '../src/services/DocumentoService';
import productoService from '../src/services/ProductServiceSimplified';


// Componente SelectCategoria - Carga categorías desde el backend
const SelectCategoria = (props: { 
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  onChange: (categoria: Categoria) => void;
  cargando: boolean;
}) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  if (props.cargando) {
    return (
      <View style={AppStyles.pickers.base}>
        <ThemedText style={AppStyles.text.helperText}>Cargando categorías...</ThemedText>
      </View>
    );
  }

  if (props.categorias.length === 0) {
    return (
      <View style={AppStyles.pickers.base}>
        <ThemedText style={AppStyles.text.helperText}>No hay categorías creadas</ThemedText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={AppStyles.pickers.base}
        onPress={() => setMostrarOpciones(!mostrarOpciones)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {props.categoriaSeleccionada && (
              <View 
                style={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: 6, 
                  backgroundColor: props.categoriaSeleccionada.color,
                  marginRight: 8 
                }} 
              />
            )}
            <ThemedText style={{ 
              fontSize: 16, 
              color: props.categoriaSeleccionada ? AppStyles.colors.textDark : '#999' 
            }}>
              {props.categoriaSeleccionada?.nombre || 'Seleccionar categoría...'}
            </ThemedText>
          </View>
          <Ionicons 
            name={mostrarOpciones ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={AppStyles.colors.primary} 
          />
        </View>
      </TouchableOpacity>

      {mostrarOpciones && (
        <View style={AppStyles.pickers.optionsContainer}>
          <ScrollView style={AppStyles.pickers.optionsScroll}>
            {props.categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id_categoria}
                style={[
                  AppStyles.pickers.optionItem,
                  props.categoriaSeleccionada?.id_categoria === categoria.id_categoria && AppStyles.pickers.optionItemSelected
                ]}
                onPress={() => {
                  props.onChange(categoria);
                  setMostrarOpciones(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View 
                    style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 6, 
                      backgroundColor: categoria.color,
                      marginRight: 10 
                    }} 
                  />
                  <ThemedText style={[
                    AppStyles.text.cardText,
                    props.categoriaSeleccionada?.id_categoria === categoria.id_categoria && { color: AppStyles.colors.primary }
                  ]}>
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

function BasicExample() {
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
    uri: string;
    name: string;
    type?: string;
    size?: number;
    tipoDocumento?: 'boleta' | 'garantia' | 'manual' | 'otro';
  } | null>(null);
  
  // Estados para categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  
  // Estados para edición
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<any>(null);
  const [parametrosCargados, setParametrosCargados] = useState(false);
  
  const MAX_LENGTH = 200;

  // Cargar parámetros y producto si está en modo edición
  useEffect(() => {
    setParametrosCargados(true);
    
    const modoEdicionStr = params.modoEdicion as string;
    const productoStr = params.producto as string;
    
    console.log('📋 Parámetros recibidos:', {
      modoEdicion: modoEdicionStr,
      tieneProducto: !!productoStr,
      longitudProducto: productoStr?.length || 0
    });
    
    if (productoStr && modoEdicionStr === 'true') {
      try {
        console.log('✏️ Detectado modo edición, parseando producto...');
        const producto = JSON.parse(productoStr);
        console.log('📊 Producto parseado:', producto);
        
        setProductoEditando(producto);
        setModoEdicion(true);
        
        // Llenar el formulario con los datos del producto
        setNombreProducto(producto.nombre || '');
        setMarca(producto.marca || '');
        setModelo(producto.modelo || '');
        setTienda(producto.tienda || '');
        setNotas(producto.notas || '');
        
        if (producto.duracion_garantia_meses) {
          setDuracionGarantia(producto.duracion_garantia_meses.toString());
        }
        
        if (producto.fecha_compra) {
          const fecha = new Date(producto.fecha_compra);
          setFechaCompra(fecha);
        }
        
        console.log('✅ Producto cargado en el formulario:', producto.nombre);
      } catch (error) {
        console.error('❌ Error parseando producto:', error);
        console.error('📝 Contenido del parámetro:', productoStr);
        Alert.alert(
          'Error',
          'No se pudieron cargar los datos del producto para editar.'
        );
      }
    }
  }, [params.producto, params.modoEdicion]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setCargandoCategorias(true);
        console.log('📂 Cargando categorías para el formulario...');
        const categoriasDelServidor = await categoriaService.getAll();
        setCategorias(categoriasDelServidor);
        console.log(`✅ ${categoriasDelServidor.length} categorías cargadas`);
        
        // Si estamos editando, establecer la categoría
        if (productoEditando && productoEditando.categoria_ids && productoEditando.categoria_ids.length > 0) {
          const categoriaId = productoEditando.categoria_ids[0];
          const categoria = categoriasDelServidor.find(c => c.id_categoria === categoriaId);
          if (categoria) {
            setCategoriaSeleccionada(categoria);
          }
        }
      } catch (error) {
        console.error('❌ Error cargando categorías:', error);
        // No bloquear el formulario si falla la carga de categorías
        setCategorias([]);
      } finally {
        setCargandoCategorias(false);
      }
    };

    if (authState.isAuthenticated) {
      cargarCategorias();
    }
  }, [authState.isAuthenticated, productoEditando]);

  const handleFileClick = async (tipoDocumento: 'boleta' | 'garantia' | 'manual') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name || asset.uri.split('/').pop() || 'documento';
        const mimeType = asset.mimeType || 'application/octet-stream';
        
        const file = {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
          size: asset.size,
          tipoDocumento: tipoDocumento,
        };
        
        setArchivoSeleccionado(file);
        
        const tipoLabel = {
          'boleta': 'Boleta',
          'garantia': 'Póliza de Garantía',
          'manual': 'Manual'
        }[tipoDocumento];
        
        Alert.alert(
          '📎 Archivo seleccionado',
          `${tipoLabel}\n${fileName}\n${documentoService.formatFileSize(asset.size || 0)}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error seleccionando archivo:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const handleGuardar = async () => {
    try {
      // Validaciones básicas
      if (!nombreProducto.trim()) {
        Alert.alert('Error', 'El nombre del producto es requerido');
        return;
      }

      if (!authState.isAuthenticated) {
        Alert.alert('Error', 'Debes estar autenticado para crear productos');
        return;
      }

      setIsLoading(true);

      // Preparar datos para el backend
      const productoData = {
        nombre: nombreProducto.trim(),
        fecha_compra: fechaCompra ? formatDateForAPI(fechaCompra) : undefined,
        duracion_garantia_meses: duracionGarantia ? parseInt(duracionGarantia) : undefined,
        marca: marca.trim() || undefined,
        modelo: modelo.trim() || undefined,
        tienda: tienda.trim() || undefined,
        notas: notas.trim() || undefined,
        categoria_ids: categoriaSeleccionada ? [categoriaSeleccionada.id_categoria] : [],
      };

      let productoGuardado;

      // MODO EDICIÓN
      if (modoEdicion && productoEditando?.id_producto) {
        console.log('✏️ Actualizando producto:', productoEditando.id_producto);
        console.log('📊 Datos a actualizar:', productoData);
        productoGuardado = await productoService.update(productoEditando.id_producto, productoData);
        console.log('✅ Producto actualizado:', productoGuardado);
      } 
      // MODO CREACIÓN
      else {
        console.log('📝 Creando producto nuevo');
        console.log('⚠️ modoEdicion:', modoEdicion, '| productoEditando:', productoEditando);
        console.log('📊 Datos a crear:', productoData);
        productoGuardado = await productoService.create(productoData);
        console.log('✅ Producto creado:', productoGuardado);
      }

      // 2. Si hay archivo, subirlo y procesar OCR (solo si es boleta)
      if (archivoSeleccionado && productoGuardado.id_producto) {
        try {
          setIsProcessingOCR(true);
          setOcrStatus('Subiendo archivo...');
          console.log('📎 Subiendo archivo...');
          
          const tipoDocumento = archivoSeleccionado.tipoDocumento || 'boleta';
          
          // Subir documento
          const { documento, ocrData } = await documentoService.uploadAndWaitOCR(
            productoGuardado.id_producto,
            {
              uri: archivoSeleccionado.uri,
              type: archivoSeleccionado.type,
              name: archivoSeleccionado.name,
            },
            tipoDocumento
          );
          
          setOcrStatus('');
          setIsProcessingOCR(false);
          
          console.log('✅ Archivo guardado:', documento);
          
          // Mostrar datos extraídos solo si hay OCR (boleta)
          if (tipoDocumento === 'boleta' && ocrData) {
            const datosExtraidos = Object.entries(ocrData)
              .filter(([key, value]) => value && key !== 'full_text')
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n');
            
            if (datosExtraidos) {
              Alert.alert(
                '✅ OCR Procesado',
                `Datos extraídos:\n\n${datosExtraidos}`,
                [{ text: 'OK' }]
              );
            }
          }
        } catch (ocrError) {
          console.error('⚠️ Error subiendo archivo:', ocrError);
          setOcrStatus('');
          setIsProcessingOCR(false);
          Alert.alert(
            'Advertencia',
            'El producto se guardó, pero hubo un error al guardar el archivo.'
          );
        }
      }

      Alert.alert(
        'Éxito', 
        modoEdicion ? 'Producto actualizado correctamente' : 'Producto guardado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/home');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ Error guardando producto:', error);
      setIsProcessingOCR(false);
      setOcrStatus('');
      Alert.alert(
        'Error', 
        error.message || 'No se pudo guardar el producto. Verifica tu conexión.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro? Se perderán los datos ingresados.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  return (
    <ScrollView style={AppStyles.containers.scrollPage}>
      <View style={AppStyles.containers.pageContent}>
        <TouchableOpacity 
          style={AppStyles.misc.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
          <ThemedText style={AppStyles.misc.backButtonText}>Volver</ThemedText>
        </TouchableOpacity>
        <View style={AppStyles.cards.base}>
        <View style={AppStyles.inputs.container}>
          <ThemedText style={AppStyles.text.label}>
            {modoEdicion ? '✏️ Editar Producto' : 'Nombre Producto'}
          </ThemedText>
          <TextInput
            style={AppStyles.inputs.base}
            placeholder="Ingrese nombre del producto"
            placeholderTextColor="#999"
            value={nombreProducto}
            onChangeText={setNombreProducto}
          />
        </View>
          
          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Fecha de compra</ThemedText>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={AppStyles.inputs.base}
                  value={fechaCompra ? formatDate(fechaCompra) : ''}
                  editable={false}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  pointerEvents="none"
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={AppStyles.colors.primary}
                  style={{ position: 'absolute', right: 12, top: 14 }}
                />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={fechaCompra || new Date()}
                mode="date"
                display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFechaCompra(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Duración Garantía</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Meses de garantía"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={duracionGarantia}
              onChangeText={setDuracionGarantia}
            />
          </View>
          
          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Marca</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Marca del producto"
              placeholderTextColor="#999"
              value={marca}
              onChangeText={setMarca}
            />
          </View>
          
          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Modelo</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Modelo del producto"
              placeholderTextColor="#999"
              value={modelo}
              onChangeText={setModelo}
            />
          </View>
          
          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Categoría</ThemedText>
            <SelectCategoria 
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              onChange={setCategoriaSeleccionada}
              cargando={cargandoCategorias}
            />
          </View>
          
          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Tienda</ThemedText>
            <TextInput
              style={AppStyles.inputs.base}
              placeholder="Tienda de compra"
              placeholderTextColor="#999"
              value={tienda}
              onChangeText={setTienda}
            />
          </View>

          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Notas</ThemedText>
            <TextInput
              style={[AppStyles.inputs.base, { minHeight: 100, textAlignVertical: 'top' }]}
              placeholder="Observaciones del producto"
              placeholderTextColor="#999"
              value={notas}
              onChangeText={setNotas}
              maxLength={MAX_LENGTH}
              multiline
              numberOfLines={4}
            />
            <ThemedText style={AppStyles.text.helperText}>
              {notas.length}/{MAX_LENGTH} caracteres usados {"\n"}
              Te quedan {MAX_LENGTH - notas.length} caracteres
            </ThemedText>
          </View>
          
          <View style={AppStyles.inputs.container}>
            <ThemedText style={AppStyles.text.label}>Documentos</ThemedText>
            
            <View style={{ marginBottom: AppStyles.spacing.md }}>
              <ThemedText style={AppStyles.text.helperText}>Boleta</ThemedText>
              <TouchableOpacity
                onPress={() => handleFileClick('boleta')}
                style={[
                  AppStyles.buttons.secondary,
                  archivoSeleccionado?.tipoDocumento === 'boleta' && { backgroundColor: '#4CAF50' }
                ]}
              >
                <Ionicons 
                  name="receipt-outline" 
                  size={18} 
                  color={archivoSeleccionado?.tipoDocumento === 'boleta' ? "white" : AppStyles.colors.textMuted} 
                  style={{ marginRight: 6 }}
                />
                <ThemedText style={AppStyles.text.buttonTextSmall}>
                  {archivoSeleccionado?.tipoDocumento === 'boleta' ? archivoSeleccionado.name : 'Subir boleta'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: AppStyles.spacing.md }}>
              <ThemedText style={AppStyles.text.helperText}>Garantía</ThemedText>
              <TouchableOpacity
                onPress={() => handleFileClick('garantia')}
                style={[
                  AppStyles.buttons.secondary,
                  archivoSeleccionado?.tipoDocumento === 'garantia' && { backgroundColor: '#4CAF50' }
                ]}
              >
                <Ionicons 
                  name="shield-checkmark-outline" 
                  size={18} 
                  color={archivoSeleccionado?.tipoDocumento === 'garantia' ? "white" : AppStyles.colors.textMuted} 
                  style={{ marginRight: 6 }}
                />
                <ThemedText style={AppStyles.text.buttonTextSmall}>
                  {archivoSeleccionado?.tipoDocumento === 'garantia' ? archivoSeleccionado.name : 'Subir póliza'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: AppStyles.spacing.md }}>
              <ThemedText style={AppStyles.text.helperText}>Manual/Otro</ThemedText>
              <TouchableOpacity
                onPress={() => handleFileClick('manual')}
                style={[
                  AppStyles.buttons.secondary,
                  archivoSeleccionado?.tipoDocumento === 'manual' && { backgroundColor: '#4CAF50' }
                ]}
              >
                <Ionicons 
                  name="document-outline" 
                  size={18} 
                  color={archivoSeleccionado?.tipoDocumento === 'manual' ? "white" : AppStyles.colors.textMuted} 
                  style={{ marginRight: 6 }}
                />
                <ThemedText style={AppStyles.text.buttonTextSmall}>
                  {archivoSeleccionado?.tipoDocumento === 'manual' ? archivoSeleccionado.name : 'Subir documento'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {archivoSeleccionado && (
              <ThemedText style={AppStyles.text.helperText}>
                {documentoService.formatFileSize(archivoSeleccionado.size)}
              </ThemedText>
            )}
          </View>

          {/* Indicador de OCR procesándose */}
          {isProcessingOCR && (
            <View style={AppStyles.states.focused}>
              <Ionicons name="hourglass-outline" size={20} color={AppStyles.colors.primary} />
              <ThemedText style={AppStyles.text.helperText}>{ocrStatus || 'Procesando OCR...'}</ThemedText>
            </View>
          )}
          
          <View style={{ flexDirection: 'row', gap: AppStyles.spacing.md, marginTop: AppStyles.spacing.lg }}>
            <TouchableOpacity 
              style={[AppStyles.buttons.secondary, { flex: 1 }]}
              onPress={handleCancelar}
              disabled={isLoading || isProcessingOCR}
            >
              <ThemedText style={AppStyles.text.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[AppStyles.buttons.primary, { flex: 1 }, (isLoading || isProcessingOCR) && { opacity: 0.6 }]}
              onPress={handleGuardar}
              disabled={isLoading || isProcessingOCR}
            >
              <ThemedText style={AppStyles.text.buttonText}>
                {isLoading ? 'Guardando...' : isProcessingOCR ? 'Procesando OCR...' : 'Guardar'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default BasicExample;