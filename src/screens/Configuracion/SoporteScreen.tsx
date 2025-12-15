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
    if (!asunto.trim() || !mensaje.trim()) {
      Alert.alert('Error', 'Por favor completa el asunto y el mensaje.');
      return;
    }
    setIsLoading(true);
    try {
      await ticketService.createTicket(asunto, mensaje);
      Alert.alert('Enviado', 'Tu mensaje fue recibido. Pronto te contactaremos.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setAsunto("");
      setMensaje("");
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar el mensaje.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        
        {/* ✅ HEADER CORREGIDO */}
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 40 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0, textAlign: 'center' }]}>
            Soporte Técnico
          </ThemedText>

          <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ width: '100%' }}>
        {/* ... (resto del contenido igual) ... */}
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