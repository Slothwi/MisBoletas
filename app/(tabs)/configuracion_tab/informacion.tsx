import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';

const Información = () => {
    const router = useRouter();

    const handleVolverAConfiguracion = () => {
        router.push('/configuracion_tab');
    };

    const abrirURL = async (url: string, nombre: string) => {
        try {
            const soportado = await Linking.canOpenURL(url);
            if (soportado) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Error", `No se puede abrir ${nombre}`);
            }
        } catch (error) {
            Alert.alert("Error", `Error al abrir ${nombre}`);
            console.error(`Error abriendo ${url}:`, error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.botonVolver}
                onPress={handleVolverAConfiguracion}
            >
                <Ionicons name="arrow-back" size={24} color="#e77573" />
                <ThemedText style={styles.botonVolverTexto}>Volver a configuraciones</ThemedText>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Términos y Condiciones */}
                <TouchableOpacity 
                    style={styles.card}
                    testID='card-terminos'
                    onPress={() => abrirURL('https://www.bcn.cl/leychile', 'Términos y condiciones')}
                >
                    <Text style={styles.cardText}>Términos y condiciones</Text>
                    <Ionicons name="open-outline" size={24} color="#e77573" />
                </TouchableOpacity>

                {/* Ley del Consumidor */}
                <TouchableOpacity 
                    style={styles.card}
                    testID='card-ley-consumidor'
                    onPress={() => abrirURL('https://www.bcn.cl/leychile', 'Ley del consumidor')}
                >
                    <Text style={styles.cardText}>Ley del consumidor</Text>
                    <Ionicons name="open-outline" size={24} color="#e77573" />
                </TouchableOpacity>

                {/* SERNAC */}
                <TouchableOpacity 
                    style={styles.card}
                    testID='card-sernac'
                    onPress={() => abrirURL('https://www.sernac.cl', 'Página oficial del SERNAC')}
                >
                    <Text style={styles.cardText}>Página oficial del SERNAC</Text>
                    <Ionicons name="open-outline" size={24} color="#e77573" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
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
    card: {
        backgroundColor: '#f5f7fa',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    cardText: {
        color: '#222',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
});

export default Información;