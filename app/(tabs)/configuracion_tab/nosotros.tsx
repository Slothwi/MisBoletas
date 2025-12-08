import { AppStyles, ThemedText } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';

const Nosotros = () => {
  const router = useRouter();
  
  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  return (
    <View style={AppStyles.containers.page}>
      <TouchableOpacity 
        style={AppStyles.misc.backButton}
        onPress={handleVolverAConfiguracion}
      >
        <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
        <ThemedText style={AppStyles.misc.backButtonText}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={AppStyles.containers.scrollPageContent}>
        <ThemedText style={[AppStyles.text.detailTitle, { marginBottom: 16 }]}>Sobre Nosotros</ThemedText>
        
        <ThemedText style={[AppStyles.text.cardSubtitle, { 
          textAlign: 'center', 
          marginBottom: 24 
        }]}>
          Conoce más sobre nuestro equipo y misión
        </ThemedText>
        
        <View style={AppStyles.cards.base}>
          <ThemedText type='subtitle'>
            ¡Hola! Somos el equipo de MisBoletas.
          </ThemedText>
          
          <ThemedText type='default'>
            Este es nuestro primer proyecto conjunto como desarrolladores de aplicaciones móviles y estamos muy felices de que lo tengas en tus manos.
            Somos cinco personas movidas por las soluciones que nos puede dar la tecnología a problemas de la vida diaria.
          </ThemedText>
        </View>
        
        <View style={AppStyles.cards.base}>
          <ThemedText type='subtitle' style={{marginTop: AppStyles.spacing.sm, marginBottom: AppStyles.spacing.lg}}>
            ¿Por qué creamos MisBoletas?
          </ThemedText>
          
          <ThemedText type='default'>
            Nos hemos enfrentado a situaciones que son comunes para muchos consumidores: compramos un producto, este se avería o necesitamos hacer uso de la garantía, y nos encontramos con el problema de no tener la boleta o documento de compra a mano.
          </ThemedText>
          
          <ThemedText type='default'>
            Hemos desarrollado esta herramienta para ayudarte a organizar tus productos de manera sencilla y eficiente.
            Desde ahora puedes tener un respaldo de las boletas y documentos de compra digital, para facilitar el cumplimiento de tus derechos y deberes como consumidor.
          </ThemedText>
          
          <ThemedText style={[AppStyles.text.cardText, { 
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: AppStyles.spacing.md
          }]}>
            Para que lo importante no se pierda.
          </ThemedText>
        </View>
        
        <View style={AppStyles.cards.base}>
          <ThemedText type='subtitle' style={{marginBottom: AppStyles.spacing.lg}}>
            Nuestra Misión
          </ThemedText>
          
          <ThemedText type='default'>
            Empoderar a los consumidores chilenos proporcionando una herramienta simple y efectiva para gestionar sus compras, garantías y derechos, aprovechando la tecnología para simplificar procesos burocráticos.
          </ThemedText>
        </View>
        
        {/* Espacio al final para mejor scroll */}
        <View style={{ height: AppStyles.spacing.xxl }} />
      </ScrollView>
    </View>
  );
};

export default Nosotros;