import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const user = {
    name: 'Nombre Usuario',
    photo: 'https://randomuser.me/api/portraits/lego/1.jpg',
};

const Configuracion = () => {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileCard}>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: user.photo }} style={styles.profileImage} />
                    <Text style={styles.profileName}>{user.name}</Text>
                </View>
            </View>

            {/* Cards Section */}
            <View style={styles.cardsContainer}>
                <TouchableOpacity style={styles.card} testID='card-configuracion' onPress={() => router.push('/configuracion_tab/detalle_configuracion')}>
                    <Text style={styles.cardText}>Configuración</Text>
                    <Ionicons name="chevron-forward" size={24} color="#1976d2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} testID='card-nosotros' onPress={() => router.push('/configuracion_tab/nosotros')}>
                    <Text style={styles.cardText}>Nosotros</Text>
                    <Ionicons name="chevron-forward" size={24} color="#1976d2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} testID='card-contacto' onPress={() => router.push('/configuracion_tab/contacto')}>
                    <Text style={styles.cardText}>Contacto</Text>
                    <Ionicons name="chevron-forward" size={24} color="#1976d2" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
    },
    profileCard: {
        width: '100%',
        backgroundColor: '#f5f7fa',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    profileContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
        marginBottom: 12,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    cardsContainer: {
        width: '100%',
        gap: 16,
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

export default Configuracion;