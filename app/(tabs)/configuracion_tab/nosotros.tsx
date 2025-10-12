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
            Somos un equipo apasionado de desarrolladores de aplicaciones móviles y web. Nos especializamos en crear soluciones digitales innovadoras que ayudan a nuestros clientes a alcanzar sus objetivos.
        </Text>
        <Text style={styles.paragraph}>
            ¡Gracias por confiar en nosotros para llevar tus ideas al siguiente nivel!
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