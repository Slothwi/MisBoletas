import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const Formulario = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    fechaCompra: '',
    garantia: '',
    marca: '',
    modelo: '',
    tienda: '',
    notas: '',
  });
  const [archivo, setArchivo] = useState<any>(null);
  const MAX_LENGTH = 200;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets.length > 0) {
        setArchivo(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para guardar el producto
    Alert.alert('Éxito', 'Producto guardado correctamente');
    // Opcional: navegar de vuelta a la pantalla anterior
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollWrapper}>
      <View style={styles.formWrapper}>
        <View style={styles.form}>
          {/* Nombre Producto */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Nombre Producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese nombre del producto"
              value={formData.nombre}
              onChangeText={(text) => handleInputChange('nombre', text)}
            />
          </View>

          {/* Fecha de compra */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Fecha de compra</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={formData.fechaCompra}
              onChangeText={(text) => handleInputChange('fechaCompra', text)}
            />
          </View>

          {/* Duración Garantía */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Duración Garantía</Text>
            <TextInput
              style={styles.input}
              placeholder="Meses de garantía"
              value={formData.garantia}
              onChangeText={(text) => handleInputChange('garantia', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Marca */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Marca</Text>
            <TextInput
              style={styles.input}
              value={formData.marca}
              onChangeText={(text) => handleInputChange('marca', text)}
            />
          </View>

          {/* Modelo */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Modelo</Text>
            <TextInput
              style={styles.input}
              value={formData.modelo}
              onChangeText={(text) => handleInputChange('modelo', text)}
            />
          </View>

          {/* Tienda */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Tienda</Text>
            <TextInput
              style={styles.input}
              value={formData.tienda}
              onChangeText={(text) => handleInputChange('tienda', text)}
            />
          </View>

          {/* Notas */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observaciones del producto"
              value={formData.notas}
              onChangeText={(text) => handleInputChange('notas', text)}
              maxLength={MAX_LENGTH}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCount}>
              {formData.notas.length}/{MAX_LENGTH} caracteres usados {'\n'}
              Te quedan <Text style={styles.charRemaining}>{MAX_LENGTH - formData.notas.length}</Text> caracteres
            </Text>
          </View>

          {/* Archivo */}
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Archivo</Text>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={handleFilePick}
            >
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.fileButtonText}>
                {archivo ? 'Archivo seleccionado' : 'Subir archivo'}
              </Text>
            </TouchableOpacity>
            {archivo && (
              <Text style={styles.fileName}>{archivo.name}</Text>
            )}
          </View>

          {/* Botones */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollWrapper: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    minWidth: 320,
    maxWidth: 400,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  form: {
    width: '100%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
  stepContainer: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 4,
    backgroundColor: '#fafafa',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
  charRemaining: {
    fontWeight: '600',
    color: '#1976d2',
  },
  fileButton: {
    backgroundColor: '#6c757d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8,
    marginTop: 4,
  },
  fileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
});

export default Formulario;