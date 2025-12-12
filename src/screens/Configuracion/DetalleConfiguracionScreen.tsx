import { ThemedText, ThemedView } from "@/src/components";
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';

export default function DetalleConfiguracionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  const cardBg = colorScheme === 'dark' ? '#1E1E1E' : colors.primaryLight;

  return (
    <ThemedView style={[containers.page, { backgroundColor: undefined }]}>
      <TouchableOpacity style={misc.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver</ThemedText>
      </TouchableOpacity>

      <ThemedText style={[text.detailTitle, { marginBottom: 24 }]}>Configuraciones</ThemedText>
      
      <View style={{ width: '100%', gap: spacing.md }}>
        <View style={[cards.interactive, { backgroundColor: cardBg, cursor: 'auto' }]}>
            <ThemedText style={text.cardText}>Notificaciones</ThemedText>
            <Switch value={notificaciones} onValueChange={setNotificaciones} />
        </View>
        
        <View style={[cards.interactive, { backgroundColor: cardBg, cursor: 'auto' }]}>
            <ThemedText style={text.cardText}>Tema oscuro</ThemedText>
            <Switch value={temaOscuro} onValueChange={setTemaOscuro} />
        </View>
        
        <View style={[cards.interactive, { backgroundColor: cardBg }]}>
            <ThemedText style={text.cardText}>Idioma</ThemedText>
            <ThemedText style={text.cardSubtitle}>Español</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}