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
  const cardBg = colorScheme === 'dark' ? '#1E1E1E' : colors.primaryLight;

  return (
    <ThemedView style={[containers.page, { backgroundColor: undefined }]}>
      <TouchableOpacity style={misc.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver</ThemedText>
      </TouchableOpacity>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        <ThemedText style={[text.detailTitle, { marginBottom: 16 }]}>Sobre Nosotros</ThemedText>
        
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