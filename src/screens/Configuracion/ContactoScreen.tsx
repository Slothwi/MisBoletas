import { ThemedText, ThemedTextInput, ThemedView } from '@/src/components';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { buttons, cards, colors, containers, inputs, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";

export default function ContactoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const cardBg = colorScheme === 'dark' ? '#1E1E1E' : colors.primaryLight;
  
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });

  return (
    <ThemedView style={[containers.page, { backgroundColor: undefined }]}>
      <TouchableOpacity style={misc.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver</ThemedText>
      </TouchableOpacity>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        <ThemedText style={[text.detailTitle, { marginBottom: 16 }]}>Contacto</ThemedText>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <ThemedText style={text.label}>Nombre</ThemedText>
          <ThemedTextInput
            style={inputs.base}
            placeholder="Tu nombre"
            value={formData.nombre}
            onChangeText={(t) => setFormData({...formData, nombre: t})}
          />
          
          <ThemedText style={text.label}>Email</ThemedText>
          <ThemedTextInput
            style={inputs.base}
            placeholder="tu@email.com"
            value={formData.email}
            onChangeText={(t) => setFormData({...formData, email: t})}
            keyboardType="email-address"
          />
          
          <ThemedText style={text.label}>Mensaje</ThemedText>
          <ThemedTextInput
            style={[inputs.base, { minHeight: 100, textAlignVertical: 'top' }]}
            placeholder="Escribe aquí..."
            value={formData.mensaje}
            onChangeText={(t) => setFormData({...formData, mensaje: t})}
            multiline
            numberOfLines={4}
          />
          
          <TouchableOpacity style={[buttons.primary, { marginTop: spacing.md }]} onPress={() => alert('Enviado')}>
            <ThemedText style={text.buttonText}>Enviar</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
            <View style={containers.row}>
                <Ionicons name="mail" size={20} color={colors.primary} />
                <ThemedText onPress={() => Linking.openURL("mailto:contacto@misboletas.com")}>contacto@misboletas.com</ThemedText>
            </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}