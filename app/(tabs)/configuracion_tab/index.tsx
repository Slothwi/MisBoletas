import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { Alert, Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { AppStyles, ThemedText } from '../../../components';
import { useAuth } from '../../../src/hooks/useAuth';

const Configuracion = () => {
    const router = useRouter();
    const { logout, authState } = useAuth();

//Función para abrir URL externa Youtube
  const handleAbrirYoutube = () => {
    Linking.openURL('https://www.youtube.com/@misBoletas-App');
  };
   
    // Usar los datos del usuario autenticado o datos por defecto
    const userData = (authState.user as any) || {
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
        <View style={AppStyles.containers.page}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={AppStyles.containers.scrollContent}>
                {/* Profile Section */}
                <View style={AppStyles.cards.profile}>
                    <View style={AppStyles.containers.centered}>
                        <Image 
                            source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                            style={AppStyles.misc.logo}
                        />
                        <ThemedText style={AppStyles.text.profileName}>{userData.nombre}</ThemedText>
                        <ThemedText style={AppStyles.text.profileEmail}>{userData.correo}</ThemedText>
                        {/* BOTÓN PARA EDITAR PERFIL - AÚN NO FUNCIONAL*/}
                        <TouchableOpacity style={AppStyles.buttons.small} onPress={() => router.push('/configuracion_tab/editar_perfil' as Href)}>
                            <ThemedText style={AppStyles.text.buttonTextSmall}>Editar Perfil</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cards Section */}
                <View style={{ width: '100%', gap: AppStyles.spacing.lg, marginBottom: AppStyles.spacing.xxl }}>
                    <TouchableOpacity 
                        style={AppStyles.cards.interactive} 
                        testID='card-configuracion' 
                        onPress={() => router.push('/configuracion_tab/detalle_configuracion' as Href)}
                    >
                        <ThemedText style={AppStyles.text.cardText}>Configuración</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={AppStyles.cards.interactive} 
                        testID='card-informacion' 
                        onPress={() => router.push('/configuracion_tab/informacion' as Href)}
                    >
                        <ThemedText style={AppStyles.text.cardText}>Información</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={AppStyles.cards.interactive} 
                        testID='card-nosotros' 
                        onPress={() => router.push('/configuracion_tab/nosotros' as Href)}
                    >
                        <ThemedText style={AppStyles.text.cardText}>Nosotros</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={AppStyles.cards.interactive} 
                        testID='card-contacto' 
                        onPress={() => router.push('/configuracion_tab/contacto' as Href)}
                    >
                        <ThemedText style={AppStyles.text.cardText}>Contacto</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={AppStyles.cards.interactive} 
                        testID='card-soporteAyuda' 
                        onPress={() => router.push('/configuracion_tab/soporte' as Href)}
                    >
                        <ThemedText style={AppStyles.text.cardText}>Ayuda</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color={AppStyles.colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[AppStyles.buttons.primary, AppStyles.containers.row]}
                        onPress={handleCerrarSesion}
                        testID='boton-cerrar-sesion'
                    >
                        <Ionicons name="log-out-outline" size={24} color={AppStyles.colors.textLight} />
                        <ThemedText style={AppStyles.text.buttonText}>Cerrar Sesión</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* BOTÓN PARA ABRIR YOUTUBE */}
                <ThemedText style={AppStyles.text.youtubeLabel}>
                    Suscríbete a nuestro canal.
                </ThemedText>
                <TouchableOpacity 
                    style={{ backgroundColor: '#FF0000', paddingVertical: AppStyles.spacing.md, paddingHorizontal: AppStyles.spacing.xl, borderRadius: AppStyles.borderRadius.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    onPress={handleAbrirYoutube}
                >
                    <Ionicons name="logo-youtube" size={40} color={AppStyles.colors.textLight} />            
                </TouchableOpacity>
            </ScrollView>       
        </View>
    );
};

export default Configuracion;