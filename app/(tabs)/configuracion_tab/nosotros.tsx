import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const Nosotros = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sobre Nosotros</Text>
        <Text style={styles.paragraph}>
            Somos un equipo apasionado de desarrolladores de aplicaciones móviles y web. Nos especializamos en crear soluciones digitales innovadoras que ayudan a nuestros clientes a alcanzar sus objetivos.
        </Text>
        <Text style={styles.paragraph}>
            ¡Gracias por confiar en nosotros para llevar tus ideas al siguiente nivel!
        </Text>
    </ScrollView>
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
        color: '#222',
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
});

export default Nosotros;