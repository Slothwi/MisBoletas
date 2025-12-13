import { ThemedText, ThemedTextInput, ThemedView } from '@/src/components';
import { ticketService } from '@/src/services/TicketService';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { buttons, cards, colors, containers, inputs, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from "react-native";

export default function SoporteScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;
  
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEnviar = async () => {
    if (!asunto.trim() || !mensaje.trim()) { Alert.alert("Error", "Completa todos los campos"); return; }
    setIsLoading(true);
    try {
      await ticketService.createTicket(asunto, mensaje);
      Alert.alert("Éxito", "Ticket enviado", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e) { Alert.alert("Error", "No se pudo enviar"); } 
    finally { setIsLoading(false); }
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
          Soporte Técnico
        </ThemedText>
      </View>

      <ScrollView style={{ width: '100%' }}>

        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <ThemedText style={text.label}>Asunto</ThemedText>
          <ThemedTextInput style={inputs.base} value={asunto} onChangeText={setAsunto} placeholder="Problema..." />
          
          <ThemedText style={text.label}>Mensaje</ThemedText>
          <ThemedTextInput 
            style={[inputs.base, { minHeight: 120, textAlignVertical: 'top' }]} 
            value={mensaje} onChangeText={setMensaje} multiline numberOfLines={5} placeholder="Detalles..." 
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <TouchableOpacity style={[buttons.secondary, { flex: 1 }]} onPress={() => { setAsunto(""); setMensaje(""); }}>
                <ThemedText style={{ color: colors.primary, textAlign: 'center', fontWeight: 'bold' }}>Limpiar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[buttons.primary, { flex: 1 }]} onPress={handleEnviar} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff"/> : <ThemedText style={text.buttonText}>Enviar</ThemedText>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}