import { ThemedText, ThemedTextInput, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import authService from '@/src/services/authService'; // ✅ Importar authService
import { buttons, cards, colors, containers, inputs, misc, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message'; // ✅ Feedback visual

const EditarPerfilScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;

  const [nombre, setNombre] = useState(authState.user?.nombre_completo || '');
  const [email] = useState(authState.user?.email || '');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false); // ✅ Estado de carga

  const handleGuardar = async () => {
    if (!nombre.trim()) {
        Alert.alert('Error', 'El nombre no puede estar vacío');
        return;
    }

    try {
        setCargando(true);
        
        // ✅ Llamada real al backend
        await authService.updateProfile({
            id_usuario: authState.user?.id_usuario, // Aunque endpoint es /me, pasamos referencia si es necesario
            nombre_completo: nombre,
            // avatar_url: ... (lógica futura de imagen)
        });

        Toast.show({ type: 'success', text1: 'Perfil actualizado correctamente' });
        
        // Volver atrás después de un breve delay
        setTimeout(() => router.back(), 1000);

    } catch (error) {
        Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta nuevamente.');
        console.error(error);
    } finally {
        setCargando(false);
    }
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
      {/* Header */}
      <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Ionicons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
        <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0 }]}>Mi Perfil</ThemedText>
      </View>

      <ScrollView style={{ width: '100%' }}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{ position: 'relative' }}>
                <Image 
                    source={{ uri: authState.user?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                    style={[misc.logo, { marginBottom: 0, borderRadius: 50, width: 100, height: 100 }]} 
                />
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, padding: 8, borderRadius: 20 }}>
                    <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ThemedText style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>{nombre || 'Usuario'}</ThemedText>
        </View>

        {/* Formulario */}
        <View style={[cards.base, { backgroundColor: cardBg }]}>
            <View style={inputs.container}>
                <ThemedText style={text.label}>Nombre Completo</ThemedText>
                <ThemedTextInput 
                    style={inputs.base} 
                    value={nombre} 
                    onChangeText={setNombre} 
                    placeholder="Tu nombre"
                    editable={!cargando}
                />
            </View>

            <View style={inputs.container}>
                <ThemedText style={text.label}>Correo Electrónico</ThemedText>
                <ThemedTextInput 
                    style={[inputs.base, { backgroundColor: isDark ? colors.cardDark : '#eee', color: isDark ? '#aaa' : '#666' }]} 
                    value={email} 
                    editable={false}
                />
                <ThemedText style={{ fontSize: 10, color: '#888', marginTop: 4 }}>El correo no se puede cambiar.</ThemedText>
            </View>

            <View style={inputs.container}>
                <ThemedText style={text.label}>Teléfono (Opcional)</ThemedText>
                <ThemedTextInput 
                    style={inputs.base} 
                    value={telefono} 
                    onChangeText={setTelefono} 
                    placeholder="+56 9..."
                    keyboardType="phone-pad"
                    editable={!cargando}
                />
            </View>

            <TouchableOpacity 
                style={[buttons.primary, { marginTop: 20, opacity: cargando ? 0.7 : 1 }]} 
                onPress={handleGuardar}
                disabled={cargando}
            >
                <ThemedText style={text.buttonText}>
                    {cargando ? 'Guardando...' : 'Guardar Cambios'}
                </ThemedText>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default EditarPerfilScreen;