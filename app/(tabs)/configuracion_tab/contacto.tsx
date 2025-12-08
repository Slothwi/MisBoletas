import { AppStyles, ThemedText, ThemedTextInput } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
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
    <View style={AppStyles.containers.page}>
      <TouchableOpacity 
                style={AppStyles.misc.backButton}
                onPress={handleVolverAConfiguracion}
              >
                <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
                <ThemedText style={AppStyles.misc.backButtonText}>Volver a configuraciones</ThemedText>
              </TouchableOpacity>
    <ScrollView contentContainerStyle={AppStyles.containers.scrollPageContent}>
      <ThemedText style={[AppStyles.text.detailTitle, { marginBottom: 16 }]}>Contacto</ThemedText>
      <ThemedText style={[AppStyles.text.cardSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
         ¿Tienes alguna pregunta o necesitas ayuda?
      </ThemedText>
      <ThemedText style={[AppStyles.text.cardSubtitle, { textAlign: 'justify', marginBottom: 24 }]}>
         Completa el formulario a continuación o contáctanos directamente vía email o teléfono.
      </ThemedText>
      
      <View style={AppStyles.cards.base}>
        <ThemedText style={AppStyles.text.label}>Nombre</ThemedText>
        <ThemedTextInput
          style={AppStyles.inputs.base}
          placeholder="Tu nombre"
          value={formData.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
          placeholderTextColor="#999"
        />
        
        <ThemedText style={AppStyles.text.label}>Correo electrónico</ThemedText>
        <ThemedTextInput
          style={AppStyles.inputs.base}
          placeholder="tu@email.com"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        
        <ThemedText style={AppStyles.text.label}>Mensaje</ThemedText>
        <ThemedTextInput
          style={[AppStyles.inputs.base, { minHeight: 120 }]}
          placeholder="Escribe tu mensaje aquí..."
          value={formData.mensaje}
          onChangeText={(text) => handleChange("mensaje", text)}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity style={AppStyles.buttons.primary} onPress={handleSubmit}>
          <ThemedText style={AppStyles.text.buttonText}>Enviar</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={AppStyles.cards.base}>
        <ThemedText style={AppStyles.text.cardText}>
          <ThemedText style={AppStyles.text.infoLabel}>Email: </ThemedText>
          <ThemedText style={{ color: AppStyles.colors.primary }} onPress={handleEmailPress}>
            contacto@misboletas.com
          </ThemedText>
        </ThemedText>
        <ThemedText style={[AppStyles.text.cardText, { marginTop: AppStyles.spacing.md }]}>
          <ThemedText style={AppStyles.text.infoLabel}>Teléfono: </ThemedText>
          <ThemedText style={{ color: AppStyles.colors.primary }} onPress={handlePhonePress}>
            +56 9 1234 5678
          </ThemedText>
        </ThemedText>
      </View>
    </ScrollView>
    </View>
  );
}