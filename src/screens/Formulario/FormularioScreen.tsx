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
import React, { useEffect, useState, useRef } from 'react';
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
  const cardBg = colorScheme === 'dark' ? colors.cardDark : colors.primaryLight;

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

  // ✅ ARREGLADO: useRef para detectar si ya cargó los params (una sola vez)
  const paramsLoadedRef = useRef(false);

  // Primero: Cargar params del producto
  useEffect(() => {
    if (!paramsLoadedRef.current && params.producto && params.modoEdicion === 'true') {
        paramsLoadedRef.current = true; // Marcar como cargado
        try {
            const p = JSON.parse(params.producto as string);
            setProductoEditando(p); 
            setModoEdicion(true);
            setNombreProducto(p.nombre || ''); 
            setMarca(p.marca || ''); 
            setModelo(p.modelo || '');
            setTienda(p.tienda || ''); 
            setPrecio(p.precio || ''); 
            setNotas(p.notas || '');
            if (p.duracion_garantia_meses) setDuracionGarantia(p.duracion_garantia_meses.toString());
            if (p.fecha_compra) setFechaCompra(new Date(p.fecha_compra));
        } catch { Alert.alert('Error', 'Datos inválidos'); }
    }
  }, []); // ✅ ARREGLADO: Sin dependencias - se ejecuta UNA SOLA VEZ al montar

  // Segundo: Cargar categorías y seleccionar la del producto
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    setCargandoCategorias(true);
    categoriaService.getAll().then(res => {
        setCategorias(res);
        
        // Si estamos editando, buscar la categoría del producto
        if (modoEdicion && productoEditando) {
            // El backend devuelve categorias como un array de objetos
            // Necesitamos obtener la categoría del producto
            const categoriasDelProducto = productoEditando.categorias || [];
            if (categoriasDelProducto.length > 0) {
                const catDelProducto = res.find(c => c.id_categoria === categoriasDelProducto[0].id_categoria);
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
        let prod;
        if (modoEdicion && productoEditando?.id_producto) prod = await productoService.update(productoEditando.id_producto, data);
        else prod = await productoService.create(data);

        // OCR Logic
        if (archivoSeleccionado && prod.id_producto) {
            setIsProcessingOCR(true);
            setOcrStatus('Analizando...');
            const { ocrData } = await documentoService.uploadAndWaitOCR(prod.id_producto, archivoSeleccionado, archivoSeleccionado.tipoDocumento);
            
            if (ocrData?.parsed_data) {
                const { comercio, fecha, total, marca: marcaOcr, modelo: modeloOcr, garantia } = ocrData.parsed_data;
                const update: any = {};
                let notasOcr = `📄 Datos extraídos de documento:\n`;
                
                if (comercio) { update.tienda = comercio; }
                if (fecha && !fechaCompra) {
                    const partes = fecha.split(/[-/]/);
                    if (partes.length===3) update.fecha_compra = `${partes[2]}-${partes[1]}-${partes[0]}`;
                }
                // Agregar total al precio y a las notas
                if (total && total > 0 && total < 500000000) { 
                    update.precio = total;
                    notasOcr += `$${total.toLocaleString()}\n`; 
                }
                if (marcaOcr && !marca) { update.marca = marcaOcr; }
                if (modeloOcr && !modelo) { update.modelo = modeloOcr; }
                if (garantia && garantia > 0 && garantia <= 120) { 
                    update.duracion_garantia_meses = garantia; 
                }
                
                if (Object.keys(update).length > 0) {
                    if (notas) update.notas = notas + '\n' + notasOcr;
                    else update.notas = notasOcr;
                    
                    await productoService.update(prod.id_producto, update);
                    Alert.alert('✨ OCR', `Datos detectados y guardados`);
                }
            }
        }
        Alert.alert('Éxito', 'Guardado', [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]);
    } catch (e: any) { Alert.alert('Error', e.message); } 
    finally { setIsLoading(false); setIsProcessingOCR(false); }
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
                    <ThemedText style={{ color: colors.primary }}>{archivoSeleccionado ? 'Archivo seleccionado' : 'Subir Boleta (OCR)'}</ThemedText>
                </View>
            </TouchableOpacity>
          </View>

          {isProcessingOCR && <ThemedText style={{ textAlign: 'center', color: colors.primary, marginBottom: 10 }}>{ocrStatus}</ThemedText>}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={() => router.back()}><ThemedText style={{ color: colors.secondary, textAlign: 'center' }}>Cancelar</ThemedText></TouchableOpacity>
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