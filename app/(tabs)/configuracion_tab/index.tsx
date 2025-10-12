import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../src/hooks/useAuth';

const Configuracion = () => {
    const router = useRouter();
    const { logout, authState } = useAuth();
    
    // Usar los datos del usuario autenticado o datos por defecto
    const userData = authState.user || {
        nombre: 'Usuario',
        correo: 'usuario@ejemplo.com'
    };
    
    const handleCerrarSesion = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: cerrarSesion
                }
            ]
        );
    };

    const cerrarSesion = async () => {
        try {
            console.log('🚪 Cerrando sesión...');
            await logout();
            console.log('✅ Sesión cerrada exitosamente');
        } catch (error) {
            console.error('❌ Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                {/* Profile Section */}
                <View style={styles.profileCard}>
                    <View style={styles.profileContainer}>
                        <Image 
                            source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                            style={styles.profileImage} 
                        />
                        <Text style={styles.profileName}>{userData.nombre}</Text>
                        <Text style={styles.profileEmail}>{userData.correo}</Text>
                    </View>
                </View>

                {/* Cards Section */}
                <View style={styles.cardsContainer}>
                    <TouchableOpacity 
                        style={styles.card} 
                        testID='card-configuracion' 
                        onPress={() => router.push('/configuracion_tab/detalle_configuracion')}
                    >
                        <Text style={styles.cardText}>Configuración</Text>
                        <Ionicons name="chevron-forward" size={24} color="#e77573" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.card} 
                        testID='card-nosotros' 
                        onPress={() => router.push('/configuracion_tab/nosotros')}
                    >
                        <Text style={styles.cardText}>Nosotros</Text>
                        <Ionicons name="chevron-forward" size={24} color="#e77573" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.card} 
                        testID='card-contacto' 
                        onPress={() => router.push('/configuracion_tab/contacto')}
                    >
                        <Text style={styles.cardText}>Contacto</Text>
                        <Ionicons name="chevron-forward" size={24} color="#e77573" />
                    </TouchableOpacity>

                    {/* Debug button - Desactivado (archivo eliminado)
                    {__DEV__ && (
                        <TouchableOpacity 
                            style={[styles.card, { backgroundColor: '#ff6b6b' }]} 
                            testID='card-debug' 
                            onPress={() => router.push('/debug-auth')}
                        >
                            <Text style={[styles.cardText, { color: '#fff' }]}>🔧 Debug Auth</Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                    */}

                    <TouchableOpacity 
                    style={styles.cerrarSesionButton}
                    onPress={handleCerrarSesion}
                    testID='boton-cerrar-sesion'
                >
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.cerrarSesionText}>Cerrar Sesión</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a8cbf0',
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
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
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
    cerrarSesionButton: {
        backgroundColor: '#e77573',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    cerrarSesionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Configuracion;