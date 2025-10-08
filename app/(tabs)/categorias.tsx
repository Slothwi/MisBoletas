import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

// Interfaz para el producto
interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  fechaCompra: string;
  garantia: string;
  tienda: string;
  notas: string;
  archivo?: {
    uri: string;
    name: string;
    type: string;
  };
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
}

// Interfaz extendida para FileSystem con la propiedad documentDirectory
interface FileSystemWithDocumentDirectory {
  documentDirectory?: string;
  cacheDirectory?: string;
  downloadAsync: (uri: string, fileUri: string, options?: any) => Promise<any>;
}

const FileSystemWithDir = FileSystem as unknown as FileSystemWithDocumentDirectory;

// Interfaz para representar una categoría
interface Categoria {
  nombre: string;
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
  cantidadProductos: number;
}

// Datos de ejemplo que simulan venir de una base de datos
const todosLosProductos: Producto[] = [
    { id: '1',
          nombre: 'Auto jeep wrangler',
          tipo: 'Auto',
          marca: 'Jeep',
          modelo: 'Wrangler 2023',
          fechaCompra: '15/03/2023',
          garantia: '36 meses',
          tienda: 'Concesionario Jeep',
          notas: 'Vehículo 4x4, color rojo',
          archivo: {
            uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            name: 'garantia_jeep.pdf',
            type: 'application/pdf'
          },
          icono: 'car'},
    { id: '2',
          nombre: 'Lavadora LG 12 kilos',
          tipo: 'Lavadora',
          marca: 'LG',
          modelo: 'WM1234X',
          fechaCompra: '20/05/2023',
          garantia: '24 meses',
          tienda: 'Electrohogar Center',
          notas: 'Lavadora de carga frontal, eficiencia A++',
          archivo: {
            uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            name: 'garantia_lg.pdf',
            type: 'application/pdf'
          },
          icono: 'washing-machine'},
    { id: '3',
          nombre: 'Microondas Samsung',
          tipo: 'Microondas',
          marca: 'Samsung',
          modelo: 'ME731K',
          fechaCompra: '10/08/2023',
          garantia: '18 meses',
          tienda: 'Tienda Departamental',
          notas: 'Microondas con grill, 25L de capacidad',
          icono: 'microwave' },
    { id: '4',
          nombre: 'Auto volkswagen beetle',
          tipo: 'Auto',
          marca: 'volkswagen',
          modelo: '345DS',
          fechaCompra: '11/11/2023',
          garantia: '4 años',
          tienda: 'Concesionario volkswagen',
          notas: 'Auto 4x4 decapotable, color azul',
          icono: 'car' },
    { id: '5',
          nombre: 'Microondas LG',
          tipo: 'Microondas',
          marca: 'LG',
          modelo: 'sdfre32',
          fechaCompra: '23/07/2020',
          garantia: '11 meses',
          tienda: 'Tienda Departamental',
          notas: 'Microondas con grill, 25L de capacidad',
          icono: 'microwave' },
    { id: '6',
          nombre: 'Refrigerador Samsung',
          tipo: 'Refrigerador',
          marca: 'Samsung',
          modelo: '45354JKN',
          fechaCompra: '11/01/2022',
          garantia: '20 meses',
          tienda: 'Tienda Departamental',
          notas: 'Microondas con grill, 25L de capacidad',
          icono: 'microwave' },
];


const Categorias = () => {
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  // Para saber qué categoría está seleccionada y mostrar sus productos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  // Para guardar la lista de productos de la categoría seleccionada
  const [productosDeCategoria, setProductosDeCategoria] = useState<Producto[]>([]);

  // Para mostrar/ocultar el mini-formulario
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  // Para manejar el texto del input del nuevo nombre de categoría
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");
  
  // MOSTRAR PRODUCTO SELECCIONADO
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Función para obtener el directorio de documentos de forma segura
  const getDocumentDirectory = (): string => {
    // Verificar si documentDirectory existe usando type assertion
    if (FileSystemWithDir.documentDirectory) {
      return FileSystemWithDir.documentDirectory;
    }
    
    // Si documentDirectory no existe, usar cacheDirectory
    if (FileSystemWithDir.cacheDirectory) {
      return FileSystemWithDir.cacheDirectory;
    }
    
    // Si ningún directorio está disponible, usar una ruta por defecto
    return 'file:///storage/emulated/0/Download/';
  };


  useEffect(() => {
    setTimeout(() => {
      // La lógica para generar categorías a partir de 'todosLosProductos' 
      const categoriasMap = new Map<string, Categoria>();
      todosLosProductos.forEach((producto) => {
        if (!categoriasMap.has(producto.tipo)) {
          categoriasMap.set(producto.tipo, {
            nombre: producto.tipo,
            icono: getIconoPorTipo(producto.tipo),
            cantidadProductos: 0,
          });
        }
        categoriasMap.get(producto.tipo)!.cantidadProductos++;
      });
      const categoriasArray = Array.from(categoriasMap.values());
      setCategorias(categoriasArray);
      setCargando(false);
    }, 1000);
  }, []);

  const getIconoPorTipo = ( tipo: string ): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (tipo) {
      case "Auto": return "car";
      case "Lavadora": return "washing-machine";
      case "Microondas": return "microwave";
      case "Refrigerador": return "fridge";
      case "Televisor": return "television-classic";
      case "Celular": return "cellphone";
      case "Computadora": return "laptop";
      case "Tablet": return "tablet";
      case "Aire acondicionado": return "air-conditioner";
      case "Cámara": return "camera";
      case "Impresora": return "printer-pos-outline";
      case "Motocicleta": return "motorbike";
      case "Reloj inteligente": return "watch";
      case "Bicicleta": return "bike";
      case "Auriculares": return "headphones";
      case "Altavoz": return "speaker";
      case "Consola de videojuegos": return "gamepad-variant";
      case "Mueble": return "sofa";
      default: return "shape-outline";
    }
  };


  // Muestra la lista de productos de la categoría seleccionada
  const handleVerCategoria = (categoria: Categoria) => {
    // Filtramos los productos que coinciden con el nombre de la categoría
    const productosFiltrados = todosLosProductos.filter(p => p.tipo === categoria.nombre);
    // Guardamos esos productos en el estado
    setProductosDeCategoria(productosFiltrados);
    // Guardamos la categoría seleccionada para cambiar la vista
    setCategoriaSeleccionada(categoria);
  };

  // Para volver de la lista de productos a la lista de categorías
  const handleVolverACategorias = () => {
    setCategoriaSeleccionada(null);
    setProductosDeCategoria([]); // Limpiamos la lista de productos
  };
  
  // Para volver de la vista de detalle del producto a la lista de productos
  const handleVolverALista = () => {
  setProductoSeleccionado(null);
  
};

  const handleVerArchivo = async (archivo: { uri: string; name: string }) => {
      try {
        const supported = await Linking.canOpenURL(archivo.uri);
        if (supported) {
          await Linking.openURL(archivo.uri);
        } else {
          Alert.alert('Error', 'No se puede abrir este tipo de archivo');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo abrir el archivo');
        console.error(error);
      }
    };

    const handleDescargarArchivo = async (archivo: { uri: string; name: string }) => {
        try {
          // Verificar si sharing está disponible
          const isSharingAvailable = await Sharing.isAvailableAsync();
          if (!isSharingAvailable) {
            Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo');
            return;
          }
    
          // Usar la función segura para obtener el directorio
          const directory = getDocumentDirectory();
          const fileUri = `${directory}${archivo.name}`;
          
          // Usar FileSystem.downloadAsync directamente (esta propiedad sí existe)
          const downloadResult = await FileSystem.downloadAsync(archivo.uri, fileUri);
    
          if (downloadResult.status === 200) {
            // Compartir el archivo descargado
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'application/pdf',
              dialogTitle: `Compartir ${archivo.name}`,
              UTI: 'com.adobe.pdf'
            });
          } else {
            Alert.alert('Error', 'No se pudo descargar el archivo');
          }
        } catch (error) {
          console.error('Error al descargar/compartir:', error);
          Alert.alert('Error', 'No se pudo procesar el archivo');
        }
      };

  // Mostrar el formulario en lugar de navegar
  const handleMostrarFormulario = () => {
    setMostrandoFormulario(true);
  };

  const handleVerProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
};

  // Guardar la nueva categoría creada en el formulario
  const handleGuardarCategoria = () => {
    const nombreLimpio = nuevoNombreCategoria.trim().toLowerCase();
    if (!nombreLimpio) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío.");
      return;
    }
    // Verificar si la categoría ya existe
    if (categorias.some(cat => cat.nombre === nombreLimpio)) {
      Alert.alert("Error", "Esa categoría ya existe.");
      return;
    }

    // Crear el objeto de la nueva categoría
    const nuevaCategoria: Categoria = {
      nombre: nombreLimpio,
      icono: getIconoPorTipo(nombreLimpio), // Le asignamos un ícono
      cantidadProductos: 0, // Inicia con 0 productos
    };

    // añadir a la lista de categorías existentes
    setCategorias([...categorias, nuevaCategoria]);
    // Ocultar el formulario y limpiamos el input
    setMostrandoFormulario(false);
    setNuevoNombreCategoria("");
  };

  // --- LÓGICA DE RENDERIZADO ---

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

     // SI SE SELECCIONÓ UN PRODUCTO, MUESTRA EL DETALLE
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
  
          <ScrollView style={styles.detalleContainer}>
            <View style={styles.detalleHeader}>
              <MaterialCommunityIcons 
                name={productoSeleccionado.icono} 
                size={48} 
                color="#e77573" 
              />
              <Text style={styles.detalleTitulo}>{productoSeleccionado.nombre}</Text>
            </View>
  
            <View style={styles.detalleInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Marca:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.marca}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modelo:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.modelo}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha de compra:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.fechaCompra}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Garantía:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.garantia}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de producto:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.tipo}</Text>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tienda:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.tienda}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Notas:</Text>
                <Text style={styles.infoValue}>{productoSeleccionado.notas}</Text>
              </View>
            </View>
  
            {productoSeleccionado.archivo && (
              <View style={styles.archivoSection}>
                <Text style={styles.archivoTitulo}>Archivo adjunto:</Text>
                <View style={styles.archivoButtons}>
                  <TouchableOpacity 
                    style={styles.archivoButton}
                    onPress={() => handleVerArchivo(productoSeleccionado.archivo!)}
                  >
                    <Ionicons name="eye" size={20} color="#fff" />
                    <Text style={styles.archivoButtonText}>Ver archivo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.archivoButton, styles.descargarButton]}
                    onPress={() => handleDescargarArchivo(productoSeleccionado.archivo!)}
                  >
                    <Ionicons name="download" size={20} color="#fff" />
                    <Text style={styles.archivoButtonText}>Descargar</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.archivoNombre}>{productoSeleccionado.archivo.name}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

  // SI SE SELECCIONÓ UNA CATEGORÍA, MUESTRA LA LISTA DE PRODUCTOS
  if (categoriaSeleccionada) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.botonVolver} onPress={handleVolverACategorias}>
            <Ionicons name="arrow-back" size={24} color="#e77573" />
            <Text style={styles.botonVolverTexto}>Volver a Categorías</Text>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.titulo}>
            Productos en {categoriaSeleccionada.nombre}
        </ThemedText>

        <ScrollView>
            {productosDeCategoria.map(producto => (
                <TouchableOpacity key={producto.id} 
                style={styles.cardProducto} 
                onPress={() => handleVerProducto(producto)}
                testID={`tarjeta-producto-${producto.tipo}`}>

                    <View style={styles.cardContent}>
                        <MaterialCommunityIcons name={producto.icono} size={24} color="#e77573"/>
                        <Text style={styles.cardTitle}>{producto.nombre}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  }

  

  // VISTA PRINCIPAL: MUESTRA CATEGORÍAS Y EL FORMULARIO
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titulo}>
        Tus Categorías
      </ThemedText>

      <ScrollView style={styles.scrollContainer}>
        {/* Mostramos la lista de categorías normal */}
        <View style={styles.cardsContainer}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.nombre}
              style={styles.card}
              onPress={() => handleVerCategoria(categoria)}
            >
              <View style={styles.cardContent}>
                <MaterialCommunityIcons name={categoria.icono} size={32} color="#e77573" />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1)}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {categoria.cantidadProductos} producto(s)
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#e77573" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* MINI FORMULARIO Y BOTÓN PARA CREAR CATEGORÍA */}
        {mostrandoFormulario ? (
            <View style={styles.formularioContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la nueva categoría"
                    value={nuevoNombreCategoria}
                    onChangeText={setNuevoNombreCategoria}
                />
                <View style={styles.botonesFormulario}>
                    <TouchableOpacity 
                        style={[styles.botonForm, styles.botonCancelar]} 
                        onPress={() => setMostrandoFormulario(false)}>
                        <Text style={styles.botonFormTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.botonForm, styles.botonGuardar]} 
                        onPress={handleGuardarCategoria}>
                        <Text style={[styles.botonFormTexto, { color: '#fff' }]}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <TouchableOpacity style={styles.botonAgregar} onPress={handleMostrarFormulario}>
                <Ionicons name="add-circle-outline" size={24} color="#e77573" />
                <Text style={styles.botonAgregarTexto}>Crear Nueva Categoría</Text>
            </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a8cbf0", padding: 24 },

  scrollContainer: { flex: 1 },

  titulo: { fontSize: 20, textAlign: "center", marginTop: 40, marginBottom: 24 },

  cardsContainer: { width: "100%", gap: 16, marginBottom: 24 },

  card: { backgroundColor: "#ffffff", flexDirection: "row", alignItems: "center", 
    justifyContent: "space-between", padding: 20, borderRadius: 12, elevation: 2, 
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },

  cardContent: { flexDirection: "row", alignItems: "center", gap: 15 },

  cardTextContainer: { flexDirection: "column" },

  cardTitle: { color: "#222", fontSize: 18, fontWeight: "600" },

  cardSubtitle: { color: "#666", fontSize: 14 },

  botonAgregar: { flexDirection: "row", alignItems: "center", justifyContent: "center", 
    paddingVertical: 16, borderRadius: 8, gap: 8, borderWidth: 1, borderColor: "#e77573", 
    backgroundColor: "#fff" },

  botonAgregarTexto: { color: "#222", fontSize: 16, fontWeight: "600" },

  // Estilos para el botón de volver en la vista de productos
  botonVolver: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },

  botonVolverTexto: { color: '#e77573', fontSize: 16, marginLeft: 8, fontWeight: '600' },

  // Estilo para las tarjetas de productos
  cardProducto: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
     justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 10 },
  
  // Estilos para el formulario
  formularioContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, 
    marginTop: 10, elevation: 2 },

  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, 
    fontSize: 16, marginBottom: 15 },

  botonesFormulario: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },

  botonForm: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },

  botonCancelar: { backgroundColor: '#e77573' },

  botonGuardar: { backgroundColor: '#e77573' },

  botonFormTexto: { fontWeight: '600', fontSize: 16 },

  // Estilos para el detalle del producto
  detalleContainer: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 12, padding: 20 },

  detalleHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },

  detalleTitulo: { fontSize: 24, fontWeight: 'bold',  color: '#222', marginTop: 16, 
     textAlign: 'center'},

  detalleInfo: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20},

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, 
    borderBottomWidth: 1, borderBottomColor: '##f0f0f0'},

  infoLabel: { fontSize: 16, fontWeight: '600', color: '#666'},

  infoValue: { fontSize: 16, color: '#222', textAlign: 'right', flex: 1, marginLeft: 10},

  archivoSection: { backgroundColor: '#fff', borderRadius: 12, padding: 20},

  archivoTitulo: {  fontSize: 18,fontWeight: '600', color: '#222', marginBottom: 16},

  archivoButtons: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  archivoButton: { backgroundColor: '#e77573', flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, 
    gap: 8,flex: 1,
  },

  descargarButton: {
    backgroundColor: '#e77573',
  },

  archivoButtonText: { color: '#fff', fontSize: 14, fontWeight: '600'},

  archivoNombre: { fontSize: 14, color: '#666', fontStyle: 'italic'},
});

export default Categorias;