import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

function BasicExample() {
  const fileInputRef = useRef(null);
  const [nota, setNota] = useState('');
  const MAX_LENGTH = 200;

  const handleFileClick = () => {
    // Lógica para manejar la selección de archivos
    console.log("Seleccionar archivo");
  };

  return (
    <ScrollView style={styles.scrollWrapper}>
      <View style={styles.formWrapper}>
        <View style={styles.form}>
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Nombre Producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese nombre del producto"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Fecha de compra</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Duración Garantía</Text>
            <TextInput
              style={styles.input}
              placeholder="Meses de garantía"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Marca</Text>
            <TextInput
              style={styles.input}
              placeholder="Marca del producto"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Modelo del producto"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Tipo de producto</Text>
            <View style={styles.picker}>
              <Text style={styles.pickerText}>Seleccionar tipo...</Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Tienda</Text>
            <TextInput
              style={styles.input}
              placeholder="Tienda de compra"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observaciones del producto"
              placeholderTextColor="#999"
              value={nota}
              onChangeText={setNota}
              maxLength={MAX_LENGTH}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCounter}>
              {nota.length}/{MAX_LENGTH} caracteres usados {"\n"}
              Te quedan <Text style={styles.charRemaining}>{MAX_LENGTH - nota.length}</Text> caracteres
            </Text>
          </View>
          
          <View style={styles.stepContainer}>
            <Text style={styles.titleText}>Archivo</Text>
            <TouchableOpacity
              onPress={handleFileClick}
              style={styles.fileButton}
            >
              <Text style={styles.fileButtonText}>Subir archivo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]}>
              <Text style={styles.buttonText}>Guardar</Text>
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
  pickerText: {
    color: '#999',
    fontSize: 16,
  },
  fileButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  fileButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BasicExample;