import { ThemedText, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { buttons, cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';

const ConfiguracionScreen = () => {
    const router = useRouter();
    const { logout, authState } = useAuth();
    const colorScheme = useColorScheme();
    
    // Adaptación para modo oscuro
    const cardBg = colorScheme === 'dark' ? colors.cardDark : colors.primaryLight;
    const iconColor = colorScheme === 'dark' ? '#fff' : colors.primary;

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

    const MenuOption = ({ title, route, testID }: { title: string, route: string, testID?: string }) => (
        <TouchableOpacity 
            style={[cards.interactive, { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }]} 
            testID={testID} 
            onPress={() => router.push(route as Href)}
        >
            <ThemedText style={[text.cardText, { color: colors.textDark }]}>{title}</ThemedText> 
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <ThemedView style={[containers.page, { backgroundColor: colorScheme === 'dark' ? colors.backgroundDark : colors.background }]}>
            <ScrollView 
                style={{ width: '100%', flex: 1 }} 
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <View style={[cards.profile, { backgroundColor: cardBg, width: '100%' }]}>
                    <View style={containers.centered}>
                        <Image 
                            source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                            style={misc.logo}
                        />
                        <ThemedText style={text.profileName}>{userData.nombre}</ThemedText>
                        <ThemedText style={text.profileEmail}>{userData.correo}</ThemedText>
                        
                        <TouchableOpacity 
                            style={[buttons.small, { marginTop: 10 }]} 
                            onPress={() => router.push('/configuracion_tab/editar_perfil' as Href)}
                        >
                            <ThemedText style={text.buttonTextSmall}>Editar Perfil</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cards Section */}
                <View style={{ width: '100%', gap: 15, marginBottom: 30 }}>
                    <MenuOption title="Configuración" route="/configuracion_tab/detalle_configuracion" testID="card-configuracion" />
                    <MenuOption title="Información" route="/configuracion_tab/informacion" testID="card-informacion" />
                    <MenuOption title="Nosotros" route="/configuracion_tab/nosotros" testID="card-nosotros" />
                    <MenuOption title="Contacto" route="/configuracion_tab/contacto" testID="card-contacto" />
                    <MenuOption title="Ayuda" route="/configuracion_tab/soporte" testID="card-soporteAyuda" />
                    <MenuOption title="Historial y Papelera" route="/configuracion_tab/historial" />

                    <TouchableOpacity 
                        style={[buttons.primary, containers.row, { marginTop: 10, justifyContent: 'center' }]}
                        onPress={handleCerrarSesion}
                        testID='boton-cerrar-sesion'
                    >
                        <Ionicons name="log-out-outline" size={24} color="#FFF" />
                        <ThemedText style={text.buttonText}>Cerrar Sesión</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* BOTÓN YOUTUBE */}
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
                    <ThemedText style={[text.youtubeLabel, { color: colors.textMuted, fontSize: 14, marginTop: 0 }]}>
                        Suscríbete a nuestro canal.
                    </ThemedText>
                    <TouchableOpacity 
                        style={{ backgroundColor: '#FF0000', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        onPress={handleAbrirYoutube}
                    >
                        <Ionicons name="logo-youtube" size={30} color="#FFF" />            
                    </TouchableOpacity>
                </View>
            </ScrollView>       
        </ThemedView>
    );
};

export default ConfiguracionScreen;