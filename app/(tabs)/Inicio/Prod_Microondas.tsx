import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

const Prod_Microondas = () => {
    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedText style={styles.title}>Microondas Samsung</ThemedText>
                <ThemedText style={styles.subtitle}>Tienda:</ThemedText>
                <ThemedText style={styles.paragraph}>
                    Ripley - Quilicura
                </ThemedText>
                <ThemedText style={styles.subtitle}>Fecha:</ThemedText>
                <ThemedText style={styles.paragraph}>
                    09/09/2025
                </ThemedText>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 24,
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
    buttonContainer: {
        flexDirection: "row",
        marginBottom: 40,
        marginHorizontal: 40,
        justifyContent: "space-around",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    button: {
        flex: 1,
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
});

export default Prod_Microondas;