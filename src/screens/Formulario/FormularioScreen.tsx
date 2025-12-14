import { ThemedText, ThemedTextInput, ThemedView } from "@/src/components";
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import categoriaService, { Categoria } from '@/src/services/CategoriaServiceSimplified';
import documentoService from '@/src/services/DocumentoService';
import productoService from '@/src/services/ProductServiceSimplified';
import { buttons, cards, colors, containers, inputs, pickers, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

// --- COMPONENTE SELECT CATEGORIA ---
const SelectCategoria = (props: { 
  categorias: Categoria[];
  categoriaSeleccionada: Categoria | null;
  onChange: (categoria: Categoria) => void;
  cargando: boolean;
}) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  
  const textColor = '#000000';
  const bgColor = '#f0f0f0';
  const dropdownBg = '#ffffff';
  const borderColor = '#ccc';

  if (props.cargando) return <View style={pickers.base}><ThemedText style={{color: textColor}}>Cargando...</ThemedText></View>;
  if (props.categorias.length === 0) return <View style={pickers.base}><ThemedText style={{color: textColor}}>Sin categorías</ThemedText></View>;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={[pickers.base, { backgroundColor: bgColor, borderColor: borderColor, borderWidth: 1 }]} 
        onPress={() => setMostrarOpciones(!mostrarOpciones)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {props.categoriaSeleccionada && <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: props.categoriaSeleccionada.color, marginRight: 10 }} />}
            <ThemedText style={{ fontSize: 16, fontWeight: props.categoriaSeleccionada ? '700' : '500', color: textColor }}>
                {props.categoriaSeleccionada?.nombre || 'Seleccionar categoría...'}
            </ThemedText>
          </View>
          <Ionicons name={mostrarOpciones ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {mostrarOpciones && (
        <View style={[pickers.optionsContainer, { backgroundColor: dropdownBg, borderColor: borderColor, borderWidth: 1 }]}>
          <ScrollView style={pickers.optionsScroll} nestedScrollEnabled>
            {props.categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id_categoria}
                style={[
                  pickers.optionItem,
                  { borderBottomColor: '#eee' },
                  props.categoriaSeleccionada?.id_categoria === cat.id_categoria && { backgroundColor: '#f0f8ff' }
                ]}
                onPress={() => { props.onChange(cat); setMostrarOpciones(false); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: cat.color, marginRight: 10 }} />
                  <ThemedText style={{ 
                      fontWeight: props.categoriaSeleccionada?.id_categoria === cat.id_categoria ? '700' : '400', 
                      color: textColor 
                  }}>
                    {cat.nombre}
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

// --- PANTALLA PRINCIPAL ---
const FormularioScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const cardBg = '#ffffff'; 
  const textColor = '#000000'; 
  const inputBg = '#f0f0f0';
  const placeholderColor = '#999999';

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
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<any>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<any>(null);

  const paramsLoadedRef = useRef(false);

  // 1. Cargar datos del producto
  useEffect(() => {
    if (!paramsLoadedRef.current && params.producto && params.modoEdicion === 'true') {
        paramsLoadedRef.current = true;
        try {
            const p = JSON.parse(params.producto as string);
            setProductoEditando(p); 
            setModoEdicion(true);
            setNombreProducto(p.nombre || ''); 
            setMarca(p.marca || ''); 
            setModelo(p.modelo || '');
            setTienda(p.tienda || ''); 
            setPrecio(p.precio ? p.precio.toString() : ''); 
            setNotas(p.notas || '');
            if (p.duracion_garantia_meses) setDuracionGarantia(p.duracion_garantia_meses.toString());
            if (p.fecha_compra) setFechaCompra(new Date(p.fecha_compra));
        } catch { Alert.alert('Error', 'Datos inválidos'); }
    }
  }, []);

  // 2. Cargar categorías y setear la inicial
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    setCargandoCategorias(true);
    categoriaService.getAll().then(res => {
        setCategorias(res);
        if (modoEdicion && productoEditando) {
            const categoriasDelProducto = productoEditando.categorias || [];
            if (categoriasDelProducto.length > 0) {
                // ✅ CORRECCIÓN 1: Convertimos a String() ambos lados para asegurar comparación correcta
                const catDelProducto = res.find(c => String(c.id_categoria) === String(categoriasDelProducto[0].id_categoria));
                if (catDelProducto) {
                    setCategoriaSeleccionada(catDelProducto);
                }
            }
        }
        setCargandoCategorias(false);
    }).catch(() => {
        setCategorias([]);
        setCargandoCategorias(false);
    });
  }, [authState.isAuthenticated, modoEdicion, productoEditando]);

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
    if (!nombreProducto.trim()) {
        Alert.alert('Error', 'El nombre del producto es requerido');
        return;
    }

    setIsLoading(true);
    
    // Preparar IDs
    const catId = categoriaSeleccionada ? categoriaSeleccionada.id_categoria : null;
    const catIds = catId ? [catId] : [];

    // ✅ CORRECCIÓN 2: Enviamos tanto 'categoria_ids' (plural) como 'categoria_id' (singular)
    // Esto asegura compatibilidad si el backend espera uno u otro.
    const data: any = { 
        nombre: nombreProducto,
        fecha_compra: fechaCompra?.toISOString().split('T')[0],
        duracion_garantia_meses: duracionGarantia ? parseInt(duracionGarantia) : undefined,
        marca: marca || undefined,
        modelo: modelo || undefined,
        tienda: tienda || undefined,
        precio: precio ? parseFloat(precio) : undefined,
        notas: notas || undefined,
        categoria_ids: catIds, // Para backends modernos
        categoria_id: catId    // Para backends tradicionales o legacy
    };

    console.log("📤 Enviando datos:", JSON.stringify(data, null, 2));

    try {
        let prod;
        if (modoEdicion && productoEditando?.id_producto) {
            console.log(`🔄 Actualizando ID: ${productoEditando.id_producto}`);
            prod = await productoService.update(productoEditando.id_producto, data);
        } else {
            console.log("✨ Creando nuevo producto");
            prod = await productoService.create(data);
        }

        if (archivoSeleccionado && prod.id_producto) {
            setIsProcessingOCR(true);
            setOcrStatus('Analizando documento...');
            const { ocrData } = await documentoService.uploadAndWaitOCR(prod.id_producto, archivoSeleccionado, archivoSeleccionado.tipoDocumento);
             if (ocrData?.parsed_data) {
                // ... lógica OCR ...
                const { comercio, fecha, total, marca: marcaOcr, modelo: modeloOcr, garantia } = ocrData.parsed_data;
                const update: any = {};
                let notasOcr = `📄 Datos extraídos:\n`;
                if (comercio) update.tienda = comercio;
                if (fecha && !fechaCompra) {
                    const partes = fecha.split(/[-/]/);
                    if (partes.length===3) update.fecha_compra = `${partes[2]}-${partes[1]}-${partes[0]}`;
                }
                if (total) { update.precio = total; notasOcr += `$${total}\n`; }
                if (marcaOcr && !marca) update.marca = marcaOcr;
                if (modeloOcr && !modelo) update.modelo = modeloOcr;
                if (garantia) update.duracion_garantia_meses = garantia; 
                
                if (Object.keys(update).length > 0) {
                    update.notas = notas ? (notas + '\n' + notasOcr) : notasOcr;
                    await productoService.update(prod.id_producto, update);
                }
             }
        }

        Alert.alert('Éxito', 'Guardado correctamente', [
            { text: 'OK', onPress: () => router.back() } 
        ]);

    } catch (e: any) {
        console.error("❌ Error al guardar:", e);
        Alert.alert('Error', e.message || 'No se pudo guardar');
    } finally {
        setIsLoading(false);
        setIsProcessingOCR(false);
    }
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: colorScheme === 'dark' ? colors.backgroundDark : colors.background }]}>
      <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Ionicons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
        <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
          {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
        </ThemedText>
      </View>

      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Nombre Producto</ThemedText>
            <ThemedTextInput 
                style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} 
                placeholder="Ej: Televisor" 
                placeholderTextColor={placeholderColor}
                value={nombreProducto} 
                onChangeText={setNombreProducto} 
            />
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Fecha de Compra</ThemedText>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                    <ThemedTextInput 
                        style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} 
                        placeholder="DD/MM/AAAA" 
                        placeholderTextColor={placeholderColor}
                        value={fechaCompra ? fechaCompra.toLocaleDateString() : ''} 
                        editable={false} 
                    />
                </View>
                <Ionicons name="calendar" size={20} color={colors.primary} style={{ position: 'absolute', right: 10, top: 12 }} />
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={fechaCompra || new Date()} mode="date" onChange={(e, d) => { setShowDatePicker(false); if(d) setFechaCompra(d); }} />}
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Categoría</ThemedText>
            <SelectCategoria 
                categorias={categorias} 
                categoriaSeleccionada={categoriaSeleccionada} 
                onChange={setCategoriaSeleccionada} 
                cargando={cargandoCategorias} 
            />
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Meses Garantía</ThemedText>
            <ThemedTextInput 
                style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} 
                placeholder="12" 
                placeholderTextColor={placeholderColor}
                keyboardType="numeric" 
                value={duracionGarantia} 
                onChangeText={setDuracionGarantia} 
            />
          </View>
          <View style={inputs.container}>
             <ThemedText style={[text.label, { color: textColor }]}>Marca</ThemedText>
             <ThemedTextInput style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} value={marca} onChangeText={setMarca} />
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Modelo</ThemedText>
            <ThemedTextInput style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} value={modelo} onChangeText={setModelo} />
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Tienda</ThemedText>
            <ThemedTextInput style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} value={tienda} onChangeText={setTienda} />
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Precio ($)</ThemedText>
            <ThemedTextInput 
                style={[inputs.base, { backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} 
                placeholder="0" 
                placeholderTextColor={placeholderColor}
                keyboardType="decimal-pad" 
                value={precio} 
                onChangeText={setPrecio} 
            />
          </View>
          <View style={inputs.container}>
            <ThemedText style={[text.label, { color: textColor }]}>Notas</ThemedText>
            <ThemedTextInput 
                style={[inputs.base, { height: 80, backgroundColor: inputBg, color: textColor, borderColor: '#ccc' }]} 
                multiline 
                value={notas} 
                onChangeText={setNotas} 
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity style={buttons.secondary} onPress={() => handleFileClick('boleta')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="camera" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                    <ThemedText style={{ color: colors.primary }}>{archivoSeleccionado ? 'Archivo seleccionado' : 'Subir Boleta (OCR)'}</ThemedText>
                </View>
            </TouchableOpacity>
          </View>
          {isProcessingOCR && <ThemedText style={{ textAlign: 'center', color: colors.primary, marginBottom: 10 }}>{ocrStatus}</ThemedText>}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={() => router.back()}>
                <ThemedText style={{ color: colors.secondary, textAlign: 'center' }}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleGuardar} disabled={isLoading || isProcessingOCR}>
                <ThemedText style={text.buttonText}>{isLoading ? 'Guardando...' : 'Guardar'}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default FormularioScreen;