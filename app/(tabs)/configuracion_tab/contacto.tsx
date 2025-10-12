import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Definir tipo para los datos del formulario
type FormData = {
  nombre: string;
  email: string;
  mensaje: string;
};

// Definir tipo para las claves del formulario
type FormField = keyof FormData;

export default function Contacto() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  const handleChange = (name: FormField, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar el formulario
    console.log("Datos del formulario:", formData);
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    
    // Limpiar formulario después del envío
    setFormData({
      nombre: "",
      email: "",
      mensaje: ""
    });
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:contacto@misboletas.com");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+56912345678");
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contacto</Text>
      <Text style={styles.text}>
        ¿Tienes dudas, sugerencias o necesitas ayuda? ¡Contáctanos!
      </Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={formData.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Escribe tu mensaje aquí..."
          value={formData.mensaje}
          onChangeText={(text) => handleChange("mensaje", text)}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Email: </Text>
          <Text style={styles.infoLink} onPress={handleEmailPress}>
            contacto@misboletas.com
          </Text>
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Teléfono: </Text>
          <Text style={styles.infoLink} onPress={handlePhonePress}>
            +56 9 1234 5678
          </Text>
        </Text>
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#e77573",
    textAlign: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#222",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#e77573",
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  info: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoLink: {
    color: "#e77573",
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
    fontWeight: '600'
  },
});