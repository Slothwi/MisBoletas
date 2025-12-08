import { AppStyles, ThemedText } from "@/components";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, TouchableOpacity, View } from 'react-native';

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
        <View style={AppStyles.containers.page}>
            <TouchableOpacity 
                style={AppStyles.misc.backButton}
                onPress={handleVolverAConfiguracion}
            >
                <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
                <ThemedText style={AppStyles.misc.backButtonText}>Volver a configuraciones</ThemedText>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={AppStyles.containers.scrollContent}>
                <TouchableOpacity 
                    style={AppStyles.cards.interactive}
                    testID='card-terminos'
                    onPress={() => abrirURL('https://www.bcn.cl/leychile', 'Términos y condiciones')}
                >
                    <ThemedText style={AppStyles.text.cardText}>Términos y condiciones</ThemedText>
                    <View style={AppStyles.misc.linkCard}>
                        <Ionicons name="open-outline" size={24} color={AppStyles.colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* Ley del Consumidor */}
                <TouchableOpacity 
                    style={AppStyles.cards.interactive}
                    testID='card-ley-consumidor'
                    onPress={() => abrirURL('https://www.bcn.cl/leychile', 'Ley del consumidor')}
                >
                    <ThemedText style={AppStyles.text.cardText}>Ley del consumidor</ThemedText>
                    <View style={AppStyles.misc.linkCard}>
                        <Ionicons name="open-outline" size={24} color={AppStyles.colors.primary} />
                    </View>
                </TouchableOpacity>

                {/* SERNAC */}
                <TouchableOpacity 
                    style={AppStyles.cards.interactive}
                    testID='card-sernac'
                    onPress={() => abrirURL('https://www.sernac.cl', 'Página oficial del SERNAC')}
                >
                    <ThemedText style={AppStyles.text.cardText}>Página oficial del SERNAC</ThemedText>
                    <View style={AppStyles.misc.linkCard}>
                        <Ionicons name="open-outline" size={24} color={AppStyles.colors.primary} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Información;