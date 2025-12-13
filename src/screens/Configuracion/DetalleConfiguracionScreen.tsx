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
  const isDark = colorScheme === 'dark';
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  const cardBg = isDark ? colors.cardDark : colors.primaryLight;

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
          Configuraciones
        </ThemedText>
      </View>
      
      <View style={{ width: '100%', gap: spacing.md }}>
        <View style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, cursor: 'auto' }]}>
            <ThemedText style={[text.cardText, { color: colors.textDark }]}>Notificaciones</ThemedText>
            <Switch value={notificaciones} onValueChange={setNotificaciones} />
        </View>
        
        <View style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, cursor: 'auto' }]}>
            <ThemedText style={[text.cardText, { color: colors.textDark }]}>Tema oscuro</ThemedText>
            <Switch value={temaOscuro} onValueChange={setTemaOscuro} />
        </View>
        
        <View style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]}>
            <ThemedText style={[text.cardText, { color: colors.textDark }]}>Idioma</ThemedText>
            <ThemedText style={[text.cardSubtitle, { color: '#666' }]}>Español</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}