import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Formulario() {
  const [nombre, setNombre] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [garantia, setGarantia] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [tienda, setTienda] = useState('');
  const [notas, setNotas] = useState('');
  const [archivo, setArchivo] = useState<ArchivoType>(null);
  type ArchivoType = DocumentPicker.DocumentPickerAsset | null;

  const handleFilePick = async () => {
  const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets.length > 0) {
        setArchivo(result.assets[0]); // Asigna el primer archivo seleccionado
    } else {
        setArchivo(null); // O maneja la cancelación
    }
    };

  return (
    <ScrollView contentContainerStyle={styles.scrollWrapper}>
      <View style={styles.formWrapper}>
        <Text style={styles.titleText}>Nombre Producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese nombre del producto"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.titleText}>Fecha de compra</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={fechaCompra}
          onChangeText={setFechaCompra}
        />

        <Text style={styles.titleText}>Duración Garantía</Text>
        <TextInput
          style={styles.input}
          placeholder="Meses de garantía"
          value={garantia}
          onChangeText={setGarantia}
          keyboardType="numeric"
        />

        <Text style={styles.titleText}>Marca</Text>
        <TextInput
          style={styles.input}
          placeholder="Marca"
          value={marca}
          onChangeText={setMarca}
        />

        <Text style={styles.titleText}>Modelo</Text>
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          value={modelo}
          onChangeText={setModelo}
        />

        <Text style={styles.titleText}>Tienda</Text>
        <TextInput
          style={styles.input}
          placeholder="Tienda"
          value={tienda}
          onChangeText={setTienda}
        />

        <Text style={styles.titleText}>Notas</Text>
        <TextInput
          style={styles.input}
          placeholder="Observaciones del producto"
          value={notas}
          onChangeText={setNotas}
          multiline
        />

        <Text style={styles.titleText}>Archivo</Text>
        <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
          <Text style={styles.fileButtonText}>
            {archivo ? 'Archivo seleccionado' : 'Subir archivo'}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <Button title="Cancelar" onPress={() => {}} color="#1976d2" />
          <Button title="Guardar" onPress={() => {}} color="#1976d2" />
        </View>
      </View>
    </ScrollView>
  );
}

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
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
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
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
    backgroundColor: '#fafafa',
  },
  fileButton: {
    backgroundColor: '#1976d2',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  fileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
});