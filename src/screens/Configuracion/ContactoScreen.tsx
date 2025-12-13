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
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;
  
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
          Contacto
        </ThemedText>
      </View>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        
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