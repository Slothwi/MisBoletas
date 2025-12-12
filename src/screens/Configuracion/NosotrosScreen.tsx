import { ThemedText } from '@/src/components';
// 👇 Importamos estilos del tema
import { cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const NosotrosScreen = () => {
  const router = useRouter();
  
  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  return (
    <View style={containers.page}>
      <TouchableOpacity 
        style={misc.backButton}
        onPress={handleVolverAConfiguracion}
      >
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={containers.scrollPageContent}>
        <ThemedText style={[text.detailTitle, { marginBottom: 16 }]}>Sobre Nosotros</ThemedText>
        
        <ThemedText style={[text.cardSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
          Conoce más sobre nuestro equipo y misión
        </ThemedText>
        
        <View style={cards.base}>
          <ThemedText type='subtitle'>
            ¡Hola! Somos el equipo de MisBoletas.
          </ThemedText>
          
          <ThemedText type='default'>
            Este es nuestro primer proyecto conjunto como desarrolladores de aplicaciones móviles y estamos muy felices de que lo tengas en tus manos.
          </ThemedText>
        </View>
        
        <View style={cards.base}>
          <ThemedText type='subtitle' style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
            ¿Por qué creamos MisBoletas?
          </ThemedText>
          
          <ThemedText type='default'>
            Nos hemos enfrentado a situaciones que son comunes para muchos consumidores...
          </ThemedText>
          
          <ThemedText style={[text.cardText, { fontStyle: 'italic', textAlign: 'center', marginTop: spacing.md }]}>
            Para que lo importante no se pierda.
          </ThemedText>
        </View>
        
        <View style={cards.base}>
          <ThemedText type='subtitle' style={{ marginBottom: spacing.lg }}>
            Nuestra Misión
          </ThemedText>
          <ThemedText type='default'>
            Empoderar a los consumidores chilenos...
          </ThemedText>
        </View>
        
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
};

export default NosotrosScreen;