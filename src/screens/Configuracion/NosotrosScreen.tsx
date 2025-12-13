import { ThemedText, ThemedView } from '@/src/components';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const NosotrosScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>
          Sobre Nosotros
        </ThemedText>
      </View>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <ThemedText type='subtitle'>¡Hola! Somos el equipo.</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>
            Este es nuestro primer proyecto conjunto como desarrolladores de aplicaciones móviles.
          </ThemedText>
        </View>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <ThemedText type='subtitle'>Nuestra Misión</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>
            Empoderar a los consumidores para que no pierdan sus garantías.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default NosotrosScreen;