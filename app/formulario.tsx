import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';


// Componente SelectTipoProducto - AGREGADO
const SelectTipoProducto = (props: { valor: string; onChange: (valor: string) => void }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const opciones = [
    'Auto', 'Lavadora', 'Microondas', 'Refrigerador', 
    'Computadora', 'Motocicleta', 'Televisor', 'Celular', 
    'Tablet', 'Secadora','Aire acondicionado','Cámara','Impresora','Reloj inteligente', 
    'Bicicleta','Auriculares','Altavoz','Consola de videojuegos','Mueble','Otro'
  ];

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={styles.picker}
        onPress={() => setMostrarOpciones(!mostrarOpciones)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 16, 
            color: props.valor ? '#000' : '#999' 
          }}>
            {props.valor || 'Seleccionar tipo de producto...'}
          </Text>
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
            {opciones.map((opcion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.opcionItem,
                  props.valor === opcion && styles.opcionSeleccionada
                ]}
                onPress={() => {
                  props.onChange(opcion);
                  setMostrarOpciones(false);
                }}
              >
                <Text style={[
                  styles.opcionText,
                  props.valor === opcion && styles.opcionTextSeleccionada
                ]}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

function BasicExample() {
  const fileInputRef = useRef(null);
  const [nota, setNota] = useState('');
  const [fechaCompra, setFechaCompra] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tipoProducto, setTipoProducto] = useState(''); // Estado para el tipo de producto
  const MAX_LENGTH = 200;

  const handleFileClick = () => {
    // Lógica para manejar la selección de archivos
    console.log("Seleccionar archivo");
  };
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
      value={fechaCompra || new Date()} // Usa fecha actual si no hay valor
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
            <SelectTipoProducto 
              valor={tipoProducto} 
              onChange={setTipoProducto} 
            />
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
});

export default BasicExample;