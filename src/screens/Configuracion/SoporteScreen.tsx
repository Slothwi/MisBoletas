import { ThemedText, ThemedTextInput } from '@/src/components';
import { ticketService } from '@/src/services/TicketService';
// 👇 IMPORTANTE: Importamos los estilos del tema (NO AppStyles)
import { buttons, cards, colors, containers, inputs, misc, spacing, states, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from "react-native";

export default function SoporteScreen() {
  const router = useRouter();
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
    if (!asunto.trim()) { Alert.alert("Error", "Por favor ingresa un asunto"); return; }
    if (!mensaje.trim()) { Alert.alert("Error", "Por favor ingresa tu mensaje"); return; }
    if (asunto.trim().length < 5) { Alert.alert("Error", "El asunto debe tener al menos 5 caracteres"); return; }
    if (mensaje.trim().length < 20) { Alert.alert("Error", "El mensaje debe tener al menos 20 caracteres"); return; }

    setIsLoading(true);
    try {
      await ticketService.createTicket(asunto, mensaje);
      Alert.alert(
        "Éxito",
        "Tu ticket de soporte ha sido creado. Nos pondremos en contacto pronto.",
        [{ text: "OK", onPress: () => { handleLimpiar(); router.push('/configuracion_tab'); } }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo enviar tu ticket. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ✅ Usamos containers.page en vez de AppStyles.containers.page
    <View style={containers.page}>
      <TouchableOpacity style={misc.backButton} onPress={handleVolverAConfiguracion}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={containers.scrollPageContent}>
        <ThemedText style={[text.detailTitle, { marginBottom: 16 }]}>Soporte Técnico</ThemedText>
        <ThemedText style={[text.cardSubtitle, { textAlign: 'center', marginBottom: 24 }]}>¿Necesitas ayuda con la aplicación?</ThemedText>
        <ThemedText style={[text.cardSubtitle, { textAlign: 'justify', marginBottom: 24 }]}>Completa el formulario para crear un ticket de soporte.</ThemedText>

        <View style={cards.base}>
          <ThemedText style={text.label}>Asunto</ThemedText>
          <ThemedTextInput
            style={inputs.base}
            placeholder="Ej: Problema con garantía"
            value={asunto}
            onChangeText={setAsunto}
            placeholderTextColor="#999"
            editable={!isLoading}
            maxLength={100}
          />
          <ThemedText style={[text.helperText, { marginTop: spacing.xs }]}>{asunto.length}/100 caracteres</ThemedText>

          <View style={{ marginBottom: spacing.md }} />

          <ThemedText style={text.label}>Mensaje</ThemedText>
          <ThemedTextInput
            style={[inputs.base, { minHeight: 120 }]}
            placeholder="Describe tu consulta..."
            value={mensaje}
            onChangeText={setMensaje}
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!isLoading}
            maxLength={500}
          />
          <ThemedText style={[text.helperText, { marginTop: spacing.xs }]}>{mensaje.length}/500 caracteres</ThemedText>

          <View style={{ marginTop: spacing.lg }} />

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={handleLimpiar} disabled={isLoading}>
              <ThemedText style={[text.buttonText, { color: colors.primary }]}>Limpiar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[buttons.primary, { flex: 1 }, isLoading && states.disabled]}
              onPress={handleEnviar}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textLight} size="small" />
              ) : (
                <ThemedText style={text.buttonText}>Enviar Ticket</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={cards.base}>
          <ThemedText style={[text.label, { marginBottom: spacing.md }]}>Información importante</ThemedText>
          
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm }}>
            <Ionicons name="information-circle" size={20} color={colors.primary} style={{ marginRight: spacing.sm, marginTop: 2 }} />
            <ThemedText type="default">Responderemos a tu ticket en un plazo máximo de 48 horas hábiles.</ThemedText>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="information-circle" size={20} color={colors.primary} style={{ marginRight: spacing.sm, marginTop: 2 }} />
            <ThemedText type="default">MisBoletas no tiene responsabilidad legal sobre las compras que realices.</ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}