import { ThemedText, ThemedTextInput } from '@/src/components';
// 👇 Importamos estilos del tema
import { buttons, cards, colors, containers, inputs, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";

type FormData = {
  nombre: string;
  email: string;
  mensaje: string;
};

type FormField = keyof FormData;

export default function ContactoScreen() {
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
    console.log("Datos del formulario:", formData);
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:contacto@misboletas.com");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+56912345678");
  };

  return (
    <View style={containers.page}>
      <TouchableOpacity 
        style={misc.backButton}
        onPress={handleVolverAConfiguracion}
      >
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={containers.scrollPageContent}>
        <ThemedText style={[text.detailTitle, { marginBottom: 16 }]}>Contacto</ThemedText>
        <ThemedText style={[text.cardSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
            ¿Tienes alguna pregunta o necesitas ayuda?
        </ThemedText>
        <ThemedText style={[text.cardSubtitle, { textAlign: 'justify', marginBottom: 24 }]}>
            Completa el formulario a continuación o contáctanos directamente vía email o teléfono.
        </ThemedText>
        
        <View style={cards.base}>
          <ThemedText style={text.label}>Nombre</ThemedText>
          <ThemedTextInput
            style={inputs.base}
            placeholder="Tu nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
            placeholderTextColor="#999"
          />
          
          <ThemedText style={text.label}>Correo electrónico</ThemedText>
          <ThemedTextInput
            style={inputs.base}
            placeholder="tu@email.com"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <ThemedText style={text.label}>Mensaje</ThemedText>
          <ThemedTextInput
            style={[inputs.base, { minHeight: 120 }]}
            placeholder="Escribe tu mensaje aquí..."
            value={formData.mensaje}
            onChangeText={(text) => handleChange("mensaje", text)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity style={buttons.primary} onPress={handleSubmit}>
            <ThemedText style={text.buttonText}>Enviar</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={cards.base}>
          <ThemedText style={text.cardText}>
            <ThemedText style={text.infoLabel}>Email: </ThemedText>
            <ThemedText style={{ color: colors.primary }} onPress={handleEmailPress}>
              contacto@misboletas.com
            </ThemedText>
          </ThemedText>
          <ThemedText style={[text.cardText, { marginTop: spacing.md }]}>
            <ThemedText style={text.infoLabel}>Teléfono: </ThemedText>
            <ThemedText style={{ color: colors.primary }} onPress={handlePhonePress}>
              +56 9 1234 5678
            </ThemedText>
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}