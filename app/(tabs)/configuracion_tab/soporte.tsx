import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useAuth } from '@/src/hooks/useAuth';
import { ticketService } from '@/src/services/TicketService';

export default function Soporte() {
    const router = useRouter();
    const { authState } = useAuth();

    // Estados del formulario
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleVolverAConfiguracion = () => {
        router.push('/configuracion_tab');
    };

    const handleLimpiar = () => {
        setAsunto("");
        setMensaje("");
    };

    const handleEnviar = async () => {
        // Validaciones
        if (!asunto.trim()) {
            Alert.alert("Error", "Por favor ingresa un asunto");
            return;
        }

        if (!mensaje.trim()) {
            Alert.alert("Error", "Por favor ingresa tu mensaje");
            return;
        }

        if (asunto.trim().length < 5) {
            Alert.alert("Error", "El asunto debe tener al menos 5 caracteres");
            return;
        }

        if (mensaje.trim().length < 20) {
            Alert.alert("Error", "El mensaje debe tener al menos 20 caracteres");
            return;
        }

        setIsLoading(true);

        try {
            console.log('📝 Enviando ticket:', { asunto, mensaje });
            await ticketService.createTicket(asunto, mensaje);

            Alert.alert(
                "Éxito",
                "Tu ticket de soporte ha sido creado. Nos pondremos en contacto pronto.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            handleLimpiar();
                            router.push('/configuracion_tab');
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('❌ Error creando ticket:', error);
            Alert.alert(
                "Error",
                error.message || "No se pudo enviar tu ticket. Intenta de nuevo."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.botonVolver}
                onPress={handleVolverAConfiguracion}
            >
                <Ionicons name="arrow-back" size={24} color="#e77573" />
                <Text style={styles.botonVolverTexto}>Volver a configuraciones</Text>
            </TouchableOpacity>

            <ScrollView style={styles.scrollWrapper} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.formWrapper}>
                    <View style={styles.form}>
                        <View style={styles.stepContainer}>
                            <Text style={styles.titleText}>Asunto</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Problema con garantía"
                                placeholderTextColor="#999"
                                value={asunto}
                                onChangeText={setAsunto}
                                editable={!isLoading}
                                maxLength={100}
                            />
                            <Text style={styles.charCounter}>
                                {asunto.length}/100 caracteres
                            </Text>
                        </View>

                        <View style={styles.stepContainer}>
                            <Text style={styles.titleText}>Mensaje</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe tu consulta, queja o problema detalladamente..."
                                placeholderTextColor="#999"
                                value={mensaje}
                                onChangeText={setMensaje}
                                multiline
                                numberOfLines={6}
                                editable={!isLoading}
                                maxLength={500}
                            />
                            <Text style={styles.charCounter}>
                                {mensaje.length}/500 caracteres
                            </Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleLimpiar}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>Limpiar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
                                onPress={handleEnviar}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Enviar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
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
      
    
