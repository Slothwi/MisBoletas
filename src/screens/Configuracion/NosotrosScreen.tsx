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
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 40 }}>
                            <Ionicons name="arrow-back" size={26} color={colors.primary} />
                        </TouchableOpacity>
                            <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0, textAlign: 'center' }]}>
                                Sobre Nosotros
                            </ThemedText>
                        <View style={{ width: 40 }} />
                    </View>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <ThemedText type='subtitle'>¡Hola! Somos el equipo de MisBoletas.</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>
            Este es nuestro primer proyecto conjunto como desarrolladores de aplicaciones móviles y estamos muy felices de que lo tengas en tus manos.
            Somos cinco personas movidas por dar soluciones prácticas a problemas cotidianos a través de la tecnología.
          </ThemedText>
        </View>
        
        <View style={[cards.base, { backgroundColor: cardBg }]}>
          <ThemedText type='subtitle'>¿Por qué creamos MisBoletas</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>
            Nos hemos enfrentado a situaciones que son comunes para muchos consumidores: perder boletas de compra, no tener acceso rápido a ellas cuando 
            las necesitamos para devoluciones o garantías, y la dificultad de organizar y almacenar estos documentos importantes. 
            Hemos desarrollado esta herramienta para resolver estos problemas y hacer que la gestión de tus boletas sea más sencilla y eficiente. Hemos desarrollado esta herramienta para ayudarte a organizar tus productos.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default NosotrosScreen;