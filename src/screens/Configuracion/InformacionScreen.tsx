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
    const cardBg = colorScheme === 'dark' ? '#1E1E1E' : colors.primaryLight;
    const iconColor = colorScheme === 'dark' ? '#fff' : colors.primary;

    const abrirURL = (url: string) => Linking.openURL(url).catch(err => console.error("Error", err));

    const InfoCard = ({ title, url }: { title: string, url: string }) => (
        <TouchableOpacity 
            style={[cards.interactive, { backgroundColor: cardBg }]}
            onPress={() => abrirURL(url)}
        >
            <ThemedText style={text.cardText}>{title}</ThemedText>
            <Ionicons name="open-outline" size={24} color={iconColor} />
        </TouchableOpacity>
    );

    return (
        <ThemedView style={[containers.page, { backgroundColor: undefined }]}>
            <TouchableOpacity style={misc.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={colors.primary} />
                <ThemedText style={misc.backButtonText}>Volver</ThemedText>
            </TouchableOpacity>

            <ScrollView style={{ width: '100%' }}>
                <View style={{ gap: spacing.md }}>
                    <InfoCard title="Términos y condiciones" url="https://www.bcn.cl/leychile" />
                    <InfoCard title="Ley del consumidor" url="https://www.bcn.cl/leychile" />
                    <InfoCard title="Página oficial del SERNAC" url="https://www.sernac.cl" />
                </View>
            </ScrollView>
        </ThemedView>
    );
};

export default InformacionScreen;