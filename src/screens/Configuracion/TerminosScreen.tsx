import { ThemedText, ThemedView } from '@/src/components';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { cards, colors, containers, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const TerminosScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const cardBg = isDark ? colors.cardDark : '#ffffff';
    const textColor = isDark ? colors.textLight : colors.textDark;
    const subTextColor = isDark ? '#aaaaaa' : '#666666';

    return (
        <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
        
        {/* HEADER CENTRADO */}
        <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 40 }}>
            <Ionicons name="arrow-back" size={26} color={colors.primary} />
            </TouchableOpacity>
            <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0, textAlign: 'center'}]}>
            Términos y Condiciones
            </ThemedText>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={[cards.base, { backgroundColor: cardBg, padding: 20 }]}>
            
            <ThemedText style={{ fontSize: 14, color: subTextColor, marginBottom: 10, fontStyle: 'italic' }}>
                Última actualización: 14 de Diciembre, 2025
            </ThemedText>

            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: textColor }}>1. Introducción</ThemedText>
            <ThemedText style={{ fontSize: 14, color: textColor, marginBottom: 15, lineHeight: 22 }}>
                Bienvenido a MisBoletas. Al utilizar nuestra aplicación, aceptas cumplir con estos términos de servicio. Esta aplicación está diseñada para ayudarte a organizar tus garantías y boletas de forma digital.
            </ThemedText>

            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: textColor }}>2. Uso de la Aplicación</ThemedText>
            <ThemedText style={{ fontSize: 14, color: textColor, marginBottom: 15, lineHeight: 22 }}>
                Usted se compromete a utilizar la aplicación solo para fines legales y de acuerdo con las leyes locales. No debe intentar vulnerar la seguridad de la app ni acceder a datos de otros usuarios.
            </ThemedText>

            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: textColor }}>3. Privacidad de Datos</ThemedText>
            <ThemedText style={{ fontSize: 14, color: textColor, marginBottom: 15, lineHeight: 22 }}>
                Tus datos son tuyos. MisBoletas utiliza encriptación para proteger tu información. No compartimos tus boletas con terceros sin tu consentimiento explícito.
            </ThemedText>

            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: textColor }}>4. Limitación de Responsabilidad</ThemedText>
            <ThemedText style={{ fontSize: 14, color: textColor, marginBottom: 15, lineHeight: 22 }}>
                MisBoletas no se hace responsable por la pérdida de garantías físicas. Recomendamos siempre guardar los originales en un lugar seguro como respaldo.
            </ThemedText>

            <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: textColor }}>5. Contacto</ThemedText>
            <ThemedText style={{ fontSize: 14, color: textColor, marginBottom: 15, lineHeight: 22 }}>
                Si tienes dudas sobre estos términos, contáctanos a través de la sección de Soporte en la aplicación.
            </ThemedText>
            </View>
        </ScrollView>
        </ThemedView>
    );
};

export default TerminosScreen;