import { ThemedText } from '@/src/components'; // ❌ Ya no importamos AppStyles de aquí
import { useAuth } from '@/src/hooks/useAuth';
import { styles } from './styles'; // Importamos estilos locales
// 👇 Importamos los estilos globales desde el tema
import { buttons, cards, colors, containers, misc, text } from '@/src/theme'; 
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';

const ConfiguracionScreen = () => {
    const router = useRouter();
    const { logout, authState } = useAuth();

    // Datos del usuario (con fallback)
    const userData = (authState.user as any) || {
        nombre: 'Usuario',
        correo: 'usuario@ejemplo.com'
    };

    const handleAbrirYoutube = () => {
        Linking.openURL('https://www.youtube.com/@misBoletas-App');
    };
    
    const handleCerrarSesion = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Cerrar Sesión", style: "destructive", onPress: cerrarSesion }
            ]
        );
    };

    const cerrarSesion = async () => {
        try {
            await logout();
        } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión.');
        }
    };

    // Componente auxiliar para las opciones del menú
    const MenuOption = ({ title, route, testID }: { title: string, route: string, testID?: string }) => (
        <TouchableOpacity 
            style={cards.interactive} // ✅ Usamos cards.interactive del tema global
            testID={testID} 
            onPress={() => router.push(route as Href)}
        >
            <ThemedText style={text.cardText}>{title}</ThemedText> 
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <View style={containers.page}>
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={[
                    containers.scrollContent, 
                    { paddingBottom: 40 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Tarjeta de Perfil */}
                <View style={styles.profileCard}>
                    <View style={containers.centered}>
                        <Image 
                            source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                            style={misc.logo}
                        />
                        {/* ✅ Usamos text.profileName del tema global */}
                        <ThemedText style={text.profileName}>{userData.nombre}</ThemedText>
                        <ThemedText style={text.profileEmail}>{userData.correo}</ThemedText>
                        
                        <TouchableOpacity 
                            style={buttons.small} // ✅ Usamos buttons.small
                            onPress={() => router.push('/configuracion_tab/editar_perfil' as Href)}
                        >
                            <ThemedText style={text.buttonTextSmall}>Editar Perfil</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. Sección de Opciones */}
                <View style={styles.cardsSection}>
                    <MenuOption title="Configuración" route="/configuracion_tab/detalle_configuracion" testID="card-configuracion" />
                    <MenuOption title="Información" route="/configuracion_tab/informacion" testID="card-informacion" />
                    <MenuOption title="Nosotros" route="/configuracion_tab/nosotros" testID="card-nosotros" />
                    <MenuOption title="Contacto" route="/configuracion_tab/contacto" testID="card-contacto" />
                    <MenuOption title="Ayuda" route="/configuracion_tab/soporte" testID="card-soporteAyuda" />

                    {/* Botón Cerrar Sesión */}
                    <TouchableOpacity 
                        style={[buttons.primary, containers.row, { justifyContent: 'center' }]}
                        onPress={handleCerrarSesion}
                        testID='boton-cerrar-sesion'
                    >
                        <Ionicons name="log-out-outline" size={24} color={colors.textLight} />
                        <ThemedText style={text.buttonText}>Cerrar Sesión</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* 3. Sección Youtube */}
                <View style={styles.youtubeContainer}>
                    <ThemedText style={text.youtubeLabel}>
                        Suscríbete a nuestro canal.
                    </ThemedText>
                    <TouchableOpacity 
                        style={styles.youtubeButton}
                        onPress={handleAbrirYoutube}
                    >
                        <Ionicons name="logo-youtube" size={40} color={colors.textLight} />            
                    </TouchableOpacity>
                </View>

            </ScrollView>       
        </View>
    );
};

export default ConfiguracionScreen;