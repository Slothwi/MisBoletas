import { ThemedText, ThemedView } from "@/src/components";
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { cards, colors, containers, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Switch, TouchableOpacity, View } from 'react-native';

export default function DetalleConfiguracionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notificaciones, setNotificaciones] = React.useState(true);

  const handleCambiarPassword = () => {
    Alert.alert("Próximamente", "Aquí podrás cambiar tu contraseña.");
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        
        {/* ✅ HEADER CENTRADO */}
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 40 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, textAlign: 'center' }]}>
            Configuraciones
          </ThemedText>

          <View style={{ width: 40 }} />
        </View>
      
      <View style={{ width: '100%', gap: spacing.md }}>
        
        <View style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]}>
            <ThemedText style={[text.cardText, { color: colors.textDark }]}>Notificaciones</ThemedText>
            <Switch value={notificaciones} onValueChange={setNotificaciones} />
        </View>
        
        <TouchableOpacity 
            style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]}
            onPress={handleCambiarPassword}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textDark} />
                <ThemedText style={[text.cardText, { color: colors.textDark }]}>Cambiar Contraseña</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]}>
            <ThemedText style={[text.cardText, { color: colors.textDark }]}>Idioma</ThemedText>
            <ThemedText style={[text.cardSubtitle, { color: '#666' }]}>Español</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}