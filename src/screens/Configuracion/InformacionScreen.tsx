import { ThemedText, ThemedView } from "@/src/components";
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';

const InformacionScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const cardBg = isDark ? colors.cardDark : colors.primaryLight;
    const iconColor = isDark ? '#fff' : colors.primary;
    const borderColor = isDark ? '#333' : '#ddd';
    const textColor = isDark ? colors.textLight : colors.textDark;

    const abrirURL = (url: string) => Linking.openURL(url).catch(err => console.error("Error", err));

    const InfoCard = ({ title, url, onPress }: { title: string, url?: string, onPress?: () => void }) => (
        <TouchableOpacity 
            style={[cards.interactive, { backgroundColor: cardBg, borderColor: borderColor, borderWidth: 1 }]}
            onPress={onPress ? onPress : () => url && abrirURL(url)}
        >
            <ThemedText style={[text.cardText, { color: textColor }]}>{title}</ThemedText>
            <Ionicons name="chevron-forward" size={24} color={iconColor} />
        </TouchableOpacity>
    );

    return (
        <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
                
            <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 40 }}>
                    <Ionicons name="arrow-back" size={26} color={colors.primary} />
                </TouchableOpacity>
                    <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0, textAlign: 'center' }]}>
                        Información Legal
                    </ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={{ width: '100%' }}>
                <View style={{ gap: spacing.md }}>
                    {/* ✅ ENLACE INTERNO ACTUALIZADO */}
                    <InfoCard 
                        title="Términos y condiciones" 
                        onPress={() => router.push('/configuracion_tab/terminos' as any)} 
                    />
                    
                    <InfoCard title="Ley del consumidor" url="https://www.bcn.cl/leychile" />
                    <InfoCard title="Página oficial del SERNAC" url="https://www.sernac.cl" />
                </View>
            </ScrollView>
        </ThemedView>
    );
};

export default InformacionScreen;