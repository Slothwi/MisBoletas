import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Href, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Interfaz extendida para FileSystem con la propiedad documentDirectory
interface FileSystemWithDocumentDirectory {
  documentDirectory?: string;
  cacheDirectory?: string;
  downloadAsync: (uri: string, fileUri: string, options?: any) => Promise<any>;
}

// Type assertion para FileSystem
const FileSystemWithDir = FileSystem as unknown as FileSystemWithDocumentDirectory;

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

const Inicio = () => {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
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

  // Simular carga de productos
  useEffect(() => {
    setTimeout(() => {
      const productosGuardados: Producto[] = [
        {
          id: '1',
          nombre: 'Auto jeep wrangler',
          tipo: 'car',
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
          icono: 'car'
        },
        {
          id: '2',
          nombre: 'Lavadora LG 12 kilos',
          tipo: 'washing-machine',
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
          icono: 'washing-machine'
        },
        {
          id: '3',
          nombre: 'Microondas Samsung',
          tipo: 'microwave',
          marca: 'Samsung',
          modelo: 'ME731K',
          fechaCompra: '10/08/2023',
          garantia: '18 meses',
          tienda: 'Tienda Departamental',
          notas: 'Microondas con grill, 25L de capacidad',
          icono: 'microwave'
        }
      ];
      
      setProductos(productosGuardados);
      setCargando(false);
    }, 1000);
  }, []);

  const handleAgregarProducto = () => {
    // Navegar al formulario usando type assertion
    router.push('app\formulario.tsx' as Href);
  };

  const handleVerProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
  };

  const handleVolverALista = () => {
    setProductoSeleccionado(null);
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

  if (cargando) {
    return (
      <View style={styles.container}>
        <ThemedText type="title" style={styles.titulo}>
          Tus Productos
        </ThemedText>
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  if (productoSeleccionado) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.botonVolver}
          onPress={handleVolverALista}
        >
          <Ionicons name="arrow-back" size={24} color="#1976d2" />
          <Text style={styles.botonVolverTexto}>Volver a la lista</Text>
        </TouchableOpacity>

        <ScrollView style={styles.detalleContainer}>
          <View style={styles.detalleHeader}>
            <MaterialCommunityIcons 
              name={productoSeleccionado.icono} 
              size={48} 
              color="#1976d2" 
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

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titulo}>
        Tus Productos
      </ThemedText>

      {productos.length === 0 ? (
        <View style={styles.sinProductosContainer}>
          <MaterialCommunityIcons name="package-variant" size={64} color="#ccc" />
          <Text style={styles.sinProductosTexto}>
            Aún no has registrado productos
          </Text>
          <Text style={styles.sinProductosSubtexto}>
            Puedes añadirlos en la sección de agregar producto
          </Text>
          
          <TouchableOpacity 
            style={styles.botonAgregar} 
            onPress={handleAgregarProducto}
            testID='boton-agregar-producto'
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.botonAgregarTexto}>Agregar Producto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.cardsContainer}>
            {productos.map((producto) => (
              <TouchableOpacity 
                key={producto.id}
                style={styles.card}
                onPress={() => handleVerProducto(producto)}
                testID={`tarjeta-producto-${producto.tipo}`}
              >
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons 
                    name={producto.icono} 
                    size={24} 
                    color="#1976d2" 
                  />
                  <Text style={styles.cardText}>{producto.nombre}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#1976d2" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.botonAgregarSecundario}
            onPress={handleAgregarProducto}
          >
            <Ionicons name="add-circle-outline" size={24} color="#1976d2" />
            <Text style={styles.botonAgregarSecundarioTexto}>Agregar otro producto</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

// Los estilos se mantienen igual que en el código anterior
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '600',
  },
  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  botonVolverTexto: {
    color: '#1976d2',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  detalleContainer: {
    flex: 1,
  },
  detalleHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  detalleTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 16,
    textAlign: 'center',
  },
  detalleInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '##f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#222',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  archivoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  archivoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  archivoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  archivoButton: {
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    flex: 1,
  },
  descargarButton: {
    backgroundColor: '#28a745',
  },
  archivoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  archivoNombre: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  sinProductosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sinProductosTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sinProductosSubtexto: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  botonAgregar: {
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  botonAgregarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  botonAgregarSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1976d2',
    backgroundColor: '#fff',
  },
  botonAgregarSecundarioTexto: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Inicio;