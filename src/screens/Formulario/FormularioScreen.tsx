import { ThemedText, ThemedTextInput, ThemedView } from "@/src/components";
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import categoriaService, { Categoria } from '@/src/services/CategoriaServiceSimplified';
import documentoService from '@/src/services/DocumentoService';
import productoService from '@/src/services/ProductServiceSimplified';
import { buttons, cards, colors, containers, inputs, misc, pickers, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, TouchableOpacity, View } from 'react-native';

const SelectCategoria = (props: { 
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  onChange: (categoria: Categoria) => void;
  cargando: boolean;
  colorScheme: 'light' | 'dark' | null;
}) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const cardBg = props.colorScheme === 'dark' ? '#333' : '#fff'; // Fondo para dropdown

  if (props.cargando) return <View style={pickers.base}><ThemedText>Cargando...</ThemedText></View>;
  if (props.categorias.length === 0) return <View style={pickers.base}><ThemedText>Sin categorías</ThemedText></View>;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={pickers.base} onPress={() => setMostrarOpciones(!mostrarOpciones)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {props.categoriaSeleccionada && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: props.categoriaSeleccionada.color, marginRight: 8 }} />}
            <ThemedText style={{ fontSize: 16 }}>{props.categoriaSeleccionada?.nombre || 'Seleccionar...'}</ThemedText>
          </View>
          <Ionicons name={mostrarOpciones ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {mostrarOpciones && (
        <View style={[pickers.optionsContainer, { backgroundColor: cardBg }]}>
          <ScrollView style={pickers.optionsScroll} nestedScrollEnabled>
            {props.categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id_categoria}
                style={[pickers.optionItem, { borderBottomColor: '#444' }]}
                onPress={() => { props.onChange(cat); setMostrarOpciones(false); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: cat.color, marginRight: 10 }} />
                  <ThemedText>{cat.nombre}</ThemedText>
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
  const colorScheme = useColorScheme();
  const cardBg = colorScheme === 'dark' ? '#1E1E1E' : colors.primaryLight;

  const [nombreProducto, setNombreProducto] = useState('');
  const [fechaCompra, setFechaCompra] = useState<Date | null>(null);
  const [duracionGarantia, setDuracionGarantia] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [tienda, setTienda] = useState('');
  const [precio, setPrecio] = useState('');
  const [notas, setNotas] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<any>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<any>(null);
  const [categoriasCargas, setCategoriasCargas] = useState(false);

  useEffect(() => {
    if (params.producto && params.modoEdicion === 'true') {
        try {
            const p = JSON.parse(params.producto as string);
            setProductoEditando(p); setModoEdicion(true);
            setNombreProducto(p.nombre || ''); setMarca(p.marca || ''); setModelo(p.modelo || '');
            setTienda(p.tienda || ''); setPrecio(p.precio || ''); setNotas(p.notas || '');
            if (p.duracion_garantia_meses) setDuracionGarantia(p.duracion_garantia_meses.toString());
            if (p.fecha_compra) setFechaCompra(new Date(p.fecha_compra));
        } catch { Alert.alert('Error', 'Datos inválidos'); }
    }
  }, [params]);

  useEffect(() => {
    if (authState.isAuthenticated && !categoriasCargas) {
        setCategoriasCargas(true);
        categoriaService.getAll().then(res => {
            setCategorias(res);
            if (productoEditando?.categoria_ids?.[0]) {
                const cat = res.find(c => c.id_categoria === productoEditando.categoria_ids[0]);
                if (cat) setCategoriaSeleccionada(cat);
            }
        }).catch(() => setCategorias([])).finally(() => setCargandoCategorias(false));
    }
  }, [authState.isAuthenticated]);

  const handleFileClick = async (tipo: string) => {
    try {
        const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
        if (!res.canceled && res.assets[0]) {
            setArchivoSeleccionado({ uri: res.assets[0].uri, name: res.assets[0].name, type: res.assets[0].mimeType, tipoDocumento: tipo });
            Alert.alert('Archivo', 'Seleccionado correctamente');
        }
    } catch { Alert.alert('Error', 'No se pudo seleccionar'); }
  };

  const handleGuardar = async () => {
    if (!nombreProducto.trim()) return Alert.alert('Error', 'Nombre requerido');
    setIsLoading(true);
    
    const data = {
        nombre: nombreProducto,
        fecha_compra: fechaCompra?.toISOString().split('T')[0],
        duracion_garantia_meses: parseInt(duracionGarantia) || undefined,
        marca, modelo, tienda, precio: precio ? parseFloat(precio) : undefined, notas,
        categoria_ids: categoriaSeleccionada ? [categoriaSeleccionada.id_categoria] : []
    };

    try {
        // Crear/actualizar producto primero
        let prod;
        if (modoEdicion && productoEditando?.id_producto) prod = await productoService.update(productoEditando.id_producto, data);
        else prod = await productoService.create(data);

        // Si hay documento seleccionado, procesarlo
        let ocrCompleted = false;
        if (archivoSeleccionado && prod.id_producto) {
            try {
                // Subir documento
                const docResponse = await documentoService.upload(prod.id_producto, archivoSeleccionado);
                console.log('[DEBUG] Documento subido:', docResponse);
                
                // Procesar OCR SÍNCRONO si se subió correctamente
                if (docResponse.documento?.id_documento) {
                    const ocrResponse = await fetch(
                        `https://misboletas-backend.onrender.com/api/v1/documentos/${docResponse.documento.id_documento}/process-ocr`,
                        { 
                            method: 'POST',
                            headers: { 
                                'Authorization': `Bearer ${authState.token}`,
                                'Content-Type': 'application/json' 
                            }
                        }
                    );
                    
                    console.log('[DEBUG] OCR Response status:', ocrResponse.status);
                    if (ocrResponse.ok) {
                        const ocrData = await ocrResponse.json();
                        console.log('[DEBUG] OCR Data recibido:', ocrData);
                        
                        // Llenar formulario con datos OCR extraídos
                        if (ocrData) {
                            console.log('[DEBUG] Actualizando campos con OCR data');
                            if (ocrData.nombre) { console.log('Setting nombre:', ocrData.nombre); setNombreProducto(ocrData.nombre); }
                            if (ocrData.marca) { console.log('Setting marca:', ocrData.marca); setMarca(ocrData.marca); }
                            if (ocrData.modelo) { console.log('Setting modelo:', ocrData.modelo); setModelo(ocrData.modelo); }
                            if (ocrData.tienda) { console.log('Setting tienda:', ocrData.tienda); setTienda(ocrData.tienda); }
                            if (ocrData.precio) { console.log('Setting precio:', ocrData.precio); setPrecio(ocrData.precio.toString()); }
                            if (ocrData.fecha_compra) { console.log('Setting fecha:', ocrData.fecha_compra); setFechaCompra(new Date(ocrData.fecha_compra)); }
                            if (ocrData.duracion_garantia_meses) { console.log('Setting garantía:', ocrData.duracion_garantia_meses); setDuracionGarantia(ocrData.duracion_garantia_meses.toString()); }
                            ocrCompleted = true;
                            Alert.alert('OCR Completado', 'Datos extraídos correctamente');
                        }
                    } else {
                        const errorText = await ocrResponse.text();
                        console.warn('OCR processing failed:', ocrResponse.status, errorText);
                        Alert.alert('Aviso', 'Documento guardado pero OCR no procesó correctamente');
                    }
                }
            } catch (docError) {
                console.error('Error procesando documento:', docError);
                Alert.alert('Aviso', 'Documento guardado pero hubo error en OCR');
            }
        }

        if (ocrCompleted || !archivoSeleccionado) {
            Alert.alert('Éxito', 'Producto guardado', [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]);
        }
    } catch (e: any) { Alert.alert('Error', e.message); } 
    finally { setIsLoading(false); }
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : colors.background }]}>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity style={misc.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <ThemedText style={misc.backButtonText}>Volver</ThemedText>
        </TouchableOpacity>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <View style={inputs.container}>
            <ThemedText style={text.label}>Nombre Producto</ThemedText>
            <ThemedTextInput style={inputs.base} placeholder="Ej: Televisor" value={nombreProducto} onChangeText={setNombreProducto} />
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Fecha de Compra</ThemedText>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                    <ThemedTextInput style={inputs.base} placeholder="DD/MM/AAAA" value={fechaCompra ? fechaCompra.toLocaleDateString() : ''} editable={false} />
                </View>
                <Ionicons name="calendar" size={20} color={colors.primary} style={{ position: 'absolute', right: 10, top: 12 }} />
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={fechaCompra || new Date()} mode="date" onChange={(e, d) => { setShowDatePicker(false); if(d) setFechaCompra(d); }} />}
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Categoría</ThemedText>
            <SelectCategoria categorias={categorias} categoriaSeleccionada={categoriaSeleccionada} onChange={setCategoriaSeleccionada} cargando={cargandoCategorias} colorScheme={colorScheme ?? null} />
          </View>

          <View style={inputs.container}>
            <ThemedText style={text.label}>Meses Garantía</ThemedText>
            <ThemedTextInput style={inputs.base} placeholder="12" keyboardType="numeric" value={duracionGarantia} onChangeText={setDuracionGarantia} />
          </View>

          <View style={inputs.container}><ThemedText style={text.label}>Marca</ThemedText><ThemedTextInput style={inputs.base} value={marca} onChangeText={setMarca} /></View>
          <View style={inputs.container}><ThemedText style={text.label}>Modelo</ThemedText><ThemedTextInput style={inputs.base} value={modelo} onChangeText={setModelo} /></View>
          <View style={inputs.container}><ThemedText style={text.label}>Tienda</ThemedText><ThemedTextInput style={inputs.base} value={tienda} onChangeText={setTienda} /></View>
          <View style={inputs.container}><ThemedText style={text.label}>Precio ($)</ThemedText><ThemedTextInput style={inputs.base} placeholder="0" keyboardType="decimal-pad" value={precio} onChangeText={setPrecio} /></View>
          <View style={inputs.container}><ThemedText style={text.label}>Notas</ThemedText><ThemedTextInput style={[inputs.base, { height: 80 }]} multiline value={notas} onChangeText={setNotas} /></View>

          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity style={buttons.secondary} onPress={() => handleFileClick('boleta')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="camera" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                    <ThemedText style={{ color: colors.primary }}>{archivoSeleccionado ? '✓ Archivo seleccionado' : 'Seleccionar documento'}</ThemedText>
                </View>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={() => router.back()}><ThemedText style={{ color: colors.secondary, textAlign: 'center' }}>Cancelar</ThemedText></TouchableOpacity>
            <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleGuardar} disabled={isLoading}>
                <ThemedText style={text.buttonText}>{isLoading ? 'Guardando...' : 'Guardar'}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default FormularioScreen;