import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
      <View style={styles.picker}>
        <Text style={{ fontSize: 16, color: '#999' }}>Cargando categorías...</Text>
      </View>
    );
  }

  if (props.categorias.length === 0) {
    return (
      <View style={styles.picker}>
        <Text style={{ fontSize: 16, color: '#999' }}>No hay categorías creadas</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={styles.picker}
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
                  backgroundColor: props.categoriaSeleccionada.color,  // Cambio: Era "Color" → Ahora "color"
                  marginRight: 8 
                }} 
              />
            )}
            <Text style={{ 
              fontSize: 16, 
              color: props.categoriaSeleccionada ? '#000' : '#999' 
            }}>
              {props.categoriaSeleccionada?.nombre || 'Seleccionar categoría...'}  {/* Cambio: Era "NombreCategoria" → Ahora "nombre" */}
            </Text>
          </View>
          <Ionicons 
            name={mostrarOpciones ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#e77573" 
          />
        </View>
      </TouchableOpacity>

      {mostrarOpciones && (
        <View style={styles.opcionesContainer}>
          <ScrollView style={styles.opcionesScroll}>
            {props.categorias.map((categoria) => (
              // Cambio: Era "CategoriaID" → Ahora "id_categoria" (UUID)
              <TouchableOpacity
                key={categoria.id_categoria}
                style={[
                  styles.opcionItem,
                  // Cambio: Era "CategoriaID" → Ahora "id_categoria" (UUID)
                  props.categoriaSeleccionada?.id_categoria === categoria.id_categoria && styles.opcionSeleccionada
                ]}
                onPress={() => {
                  props.onChange(categoria);
                  setMostrarOpciones(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Cambio: Era "Color" → Ahora "color" */}
                  <View 
                    style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 6, 
                      backgroundColor: categoria.color,
                      marginRight: 10 
                    }} 
                  />
                  <Text style={[
                    styles.opcionText,
                    // Cambio: Era "CategoriaID" → Ahora "id_categoria" (UUID)
                    props.categoriaSeleccionada?.id_categoria === categoria.id_categoria && styles.opcionTextSeleccionada
                  ]}>
                    {/* Cambio: Era "NombreCategoria" → Ahora "nombre" */}
                    {categoria.nombre}
                  </Text>
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
  const fileInputRef = useRef(null);
  
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
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{
    uri: string;
    name: string;
    type?: string;
    size?: number;
  } | null>(null);
  
  // Estados para categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  
  const MAX_LENGTH = 200;

  // Cargar categorías al montar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setCargandoCategorias(true);
        console.log('📂 Cargando categorías para el formulario...');
        const categoriasDelServidor = await categoriaService.getAll();
        setCategorias(categoriasDelServidor);
        console.log(`✅ ${categoriasDelServidor.length} categorías cargadas`);
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
  }, [authState.isAuthenticated]);

  const handleFileClick = async () => {
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
        
        // Extraer nombre del archivo de la URI
        const uriParts = asset.uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        
        setArchivoSeleccionado({
          uri: asset.uri,
          name: fileName || 'documento.jpg',
          type: asset.type === 'image' ? 'image/jpeg' : undefined,
          size: asset.fileSize,
        });
        
        Alert.alert(
          'Archivo seleccionado',
          `${fileName}\n${documentoService.formatFileSize(asset.fileSize)}`
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
        nombre: nombreProducto.trim(),  // Cambio: Era "NombreProducto" → Ahora "nombre"
        fecha_compra: fechaCompra ? formatDateForAPI(fechaCompra) : undefined,  // Cambio: Era "FechaCompra" → Ahora "fecha_compra"
        duracion_garantia_meses: duracionGarantia ? parseInt(duracionGarantia) : undefined,  // Cambio: Era "DuracionGarantia" en días → Ahora "duracion_garantia_meses"
        marca: marca.trim() || undefined,  // Cambio: Era "Marca" PascalCase → Ahora "marca" snake_case
        modelo: modelo.trim() || undefined,  // Cambio: Era "Modelo" → Ahora "modelo"
        tienda: tienda.trim() || undefined,  // Cambio: Era "Tienda" → Ahora "tienda"
        notas: notas.trim() || undefined,  // Cambio: Era "Notas" → Ahora "notas"
        id_categoria: categoriaSeleccionada?.id_categoria,  // Cambio: Era "categoria_id" con "CategoriaID" → Ahora "id_categoria" (UUID)
      };

      console.log('📝 Creando producto:', productoData);
      console.log('🏷️ categoriaSeleccionada completa:', categoriaSeleccionada);
      console.log('🏷️ id_categoria extraída:', categoriaSeleccionada?.id_categoria);  // Cambio: Era "CategoriaID" → Ahora "id_categoria" (UUID)
      if (categoriaSeleccionada) {
        console.log('🏷️ Con categoría:', categoriaSeleccionada.nombre);  // Cambio: Era "NombreCategoria" → Ahora "nombre"
      } else {
        console.log('⚠️ NO hay categoría seleccionada');
      }

      // Enviar al backend
      const nuevoProducto = await productoService.create(productoData);
      
      console.log('✅ Producto creado exitosamente:', nuevoProducto);

      // Si hay un archivo seleccionado, subirlo
      if (archivoSeleccionado && nuevoProducto.id_producto) {  // Cambio: Era "ProductoID" → Ahora "id_producto" (UUID)
        try {
          console.log('📎 Subiendo archivo asociado al producto...');
          
          await documentoService.upload(
            nuevoProducto.id_producto,  // Cambio: Era "ProductoID" → Ahora "id_producto" (UUID)
            {
              uri: archivoSeleccionado.uri,
              type: archivoSeleccionado.type,
              name: archivoSeleccionado.name,
            }
          );
          
          console.log('✅ Archivo subido exitosamente');
        } catch (uploadError) {
          console.error('⚠️ Error subiendo archivo:', uploadError);
          // No bloquear el flujo si falla el upload del archivo
          Alert.alert(
            'Advertencia',
            'El producto se guardó correctamente, pero hubo un error al subir el archivo. Puedes intentar subirlo después.'
          );
        }
      }

      Alert.alert(
        'Éxito', 
        archivoSeleccionado 
          ? 'Producto y documento guardados correctamente'
          : 'Producto guardado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navegar específicamente a la pantalla de productos
              router.replace('/(tabs)/home');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ Error guardando producto:', error);
      Alert.alert(
        'Error', 
        error.message || 'No se pudo guardar el producto. Verifica tu conexión e intenta nuevamente.'
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
    <ScrollView style={styles.scrollWrapper}>
      <View style={styles.formWrapper}>
        <TouchableOpacity 
          style={styles.botonVolver}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#e77573" />
          <ThemedText style={styles.botonVolverTexto}>Volver</ThemedText>
        </TouchableOpacity>
        <View style={styles.form}>
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Nombre Producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese nombre del producto"
              placeholderTextColor="#999"
              value={nombreProducto}
              onChangeText={setNombreProducto}
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Fecha de compra</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={styles.input}
                  value={fechaCompra ? formatDate(fechaCompra) : ''}
                  editable={false}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  pointerEvents="none"
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#e77573"
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

          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Duración Garantía</Text>
            <TextInput
              style={styles.input}
              placeholder="Meses de garantía"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={duracionGarantia}
              onChangeText={setDuracionGarantia}
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Marca</Text>
            <TextInput
              style={styles.input}
              placeholder="Marca del producto"
              placeholderTextColor="#999"
              value={marca}
              onChangeText={setMarca}
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Modelo del producto"
              placeholderTextColor="#999"
              value={modelo}
              onChangeText={setModelo}
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Categoría</Text>
            <SelectCategoria 
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              onChange={setCategoriaSeleccionada}
              cargando={cargandoCategorias}
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Tienda</Text>
            <TextInput
              style={styles.input}
              placeholder="Tienda de compra"
              placeholderTextColor="#999"
              value={tienda}
              onChangeText={setTienda}
            />
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observaciones del producto"
              placeholderTextColor="#999"
              value={notas}
              onChangeText={setNotas}
              maxLength={MAX_LENGTH}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCounter}>
              {notas.length}/{MAX_LENGTH} caracteres usados {"\n"}
              Te quedan <Text style={styles.charRemaining}>{MAX_LENGTH - notas.length}</Text> caracteres
            </Text>
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Archivo</Text>
            <TouchableOpacity
              onPress={handleFileClick}
              style={[
                styles.fileButton,
                archivoSeleccionado && styles.fileButtonSelected
              ]}
            >
              <Ionicons 
                name={archivoSeleccionado ? "checkmark-circle" : "cloud-upload-outline"} 
                size={20} 
                color={archivoSeleccionado ? "#4CAF50" : "#e77573"} 
                style={{ marginRight: 8 }}
              />
              <Text style={[
                styles.fileButtonText,
                archivoSeleccionado && styles.fileButtonTextSelected
              ]}>
                {archivoSeleccionado ? archivoSeleccionado.name : 'Subir archivo'}
              </Text>
            </TouchableOpacity>
            {archivoSeleccionado && (
              <Text style={styles.fileInfo}>
                {documentoService.formatFileSize(archivoSeleccionado.size)}
              </Text>
            )}
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancelar}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleGuardar}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  formWrapper: {
    padding: 16,
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#a8cbf0', 
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  stepContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  charRemaining: {
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    justifyContent: 'center',
  },
  // ESTILOS AGREGADOS para el selector
  opcionesContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: 'white',
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000, // NUEVO: Para que se muestre encima de otros elementos
    position: 'relative', // NUEVO: Necesario para que funcione zIndex
  },
  opcionesScroll: {
    maxHeight: 200,
  },
  opcionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  opcionSeleccionada: {
    backgroundColor: '#e3f2fd',
  },
  opcionText: {
    fontSize: 16,
    color: '#000',
  },
  opcionTextSeleccionada: {
    color: '#1976d2',
    fontWeight: '600',
  },
  fileButton: {
    backgroundColor: '#e77573',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fileButtonSelected: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  fileButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  fileButtonTextSelected: {
    color: 'white',
  },
  fileInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 110,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e77573',
  },
  saveButton: {
    backgroundColor: '#e77573',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
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
});

export default BasicExample;