import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const router = useRouter();
const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };
const Información = () => (
    <View style={styles.container}>
        <TouchableOpacity 
                style={styles.botonVolver}
                onPress={handleVolverAConfiguracion}
              >
                <Ionicons name="arrow-back" size={24} color="#e77573" />
                <ThemedText style={styles.botonVolverTexto}>Volver a configuraciones</ThemedText>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.container}>
        {/*Cambiar direccionamiento*/}
        <TouchableOpacity 
            style={styles.card}
            testID='card-terminos'
            onPress={() => router.push('/configuracion_tab/nosotros' as Href)}
        >
            <Text style={styles.cardText}>Términos y condiciones</Text>
            <Ionicons name="chevron-forward" size={24} color="#e77573" />
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.card}
            testID='card-ley-consumidor'
            onPress={() => router.push('/configuracion_tab/nosotros' as Href)}
        >
            <Text style={styles.cardText}>Ley del consumidor</Text>
            <Ionicons name="chevron-forward" size={24} color="#e77573" />
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.card}
            testID='card-sernac'
            onPress={() => router.push('/configuracion_tab/nosotros' as Href)}
        >
            <Text style={styles.cardText}>Página oficial del SERNAC</Text>
            <Ionicons name="chevron-forward" size={24} color="#e77573" />
        </TouchableOpacity>
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
    cardsContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        backgroundColor: '#f5f7fa',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    cardText: {
        color: '#222',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Información;