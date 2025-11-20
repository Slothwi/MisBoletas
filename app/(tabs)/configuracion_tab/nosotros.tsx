import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const router = useRouter();
const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };
const Nosotros = () => (
    <View style={styles.container}>
        <TouchableOpacity 
                style={styles.botonVolver}
                onPress={handleVolverAConfiguracion}
              >
                <Ionicons name="arrow-back" size={24} color="#e77573" />
                <ThemedText style={styles.botonVolverTexto}>Volver a configuraciones</ThemedText>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sobre Nosotros</Text>
        <Text style={styles.paragraph}>
            ¡Hola! Somos el equipo de MisBoletas.
        </Text>
        <Text style={styles.paragraph}>
            Este es nuestro primer proyecto conjunto como desarrolladores de aplicaciones móviles y estamos muy felices de que lo tengas en tus manos.
            Somos cinco personas movidas por las soluciones que nos puede dar la tecnología a problemas de la vida diaria.
        </Text>
        <Text style={styles.subtitle}>¿Por qué creamos MisBoletas?</Text>
        <Text style={styles.paragraph}>
            Nos hemos enfrentado a situaciones que son comunes para muchos consumidores: compramos un producto, este se avería o necesitamos hacer uso de la garantía, y nos encontramos con el problema de no tener la boleta o documento de compra a mano.
            
            Hemos desarrollado esta herramienta para ayudarte a organizar tus productos de manera sencilla y eficiente.
            Desde ahora puedes tener un respaldo de las boletas y documentos de compra digital, para facilitar el cumplimiento de tus derechos y deberes como consumidor.
        </Text>
        <Text style={styles.paragraph}>
            Para que lo importante no se pierda.
        </Text>
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#e77573',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
        color: '#333',
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 12,
        color: '#444',
        lineHeight: 22,
    },
    botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    },
    botonVolverTexto: {
    color: '#e77573',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default Nosotros;