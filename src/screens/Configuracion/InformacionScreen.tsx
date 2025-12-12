import { ThemedText } from "@/src/components";
// 👇 Importamos estilos del tema
import { cards, colors, containers, misc, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, TouchableOpacity, View } from 'react-native';

const InformacionScreen = () => {
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
        <View style={containers.page}>
            <TouchableOpacity 
                style={misc.backButton}
                onPress={handleVolverAConfiguracion}
            >
                <Ionicons name="arrow-back" size={24} color={colors.primary} />
                <ThemedText style={misc.backButtonText}>Volver a configuraciones</ThemedText>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={containers.scrollContent}>
                <TouchableOpacity 
                    style={cards.interactive}
                    testID='card-terminos'
                    onPress={() => abrirURL('https://www.bcn.cl/leychile', 'Términos y condiciones')}
                >
                    <ThemedText style={text.cardText}>Términos y condiciones</ThemedText>
                    <View style={misc.linkCard}>
                        <Ionicons name="open-outline" size={24} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={cards.interactive}
                    testID='card-ley-consumidor'
                    onPress={() => abrirURL('https://www.bcn.cl/leychile', 'Ley del consumidor')}
                >
                    <ThemedText style={text.cardText}>Ley del consumidor</ThemedText>
                    <View style={misc.linkCard}>
                        <Ionicons name="open-outline" size={24} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={cards.interactive}
                    testID='card-sernac'
                    onPress={() => abrirURL('https://www.sernac.cl', 'Página oficial del SERNAC')}
                >
                    <ThemedText style={text.cardText}>Página oficial del SERNAC</ThemedText>
                    <View style={misc.linkCard}>
                        <Ionicons name="open-outline" size={24} color={colors.primary} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default InformacionScreen;