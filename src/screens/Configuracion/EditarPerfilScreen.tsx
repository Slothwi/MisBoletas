import { ThemedText, ThemedTextInput, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { buttons, cards, colors, containers, inputs, misc, text } from '@/src/theme';
// 👇 Importamos el helper y las claves (keys) para hacer la lista
import { AVATAR_KEYS, getAvatarSource } from '@/src/utils/avatarHelpers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const EditarPerfilScreen = () => {
  const router = useRouter();
  // Usamos updateProfile del hook useAuth para que actualice todo el estado de la app
  const { authState, updateProfile } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;

  const [nombre, setNombre] = useState(authState.user?.nombre_completo || '');
  const [email] = useState(authState.user?.email || '');
  const [telefono, setTelefono] = useState('');
  
  // Guardamos solo la "clave" (ej: 'lego1'), no la ruta completa
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(authState.user?.avatar_url || 'lego1');
  
  const [cargando, setCargando] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
        Alert.alert('Error', 'El nombre no puede estar vacío');
        return;
    }

    try {
        setCargando(true);
        
        // Enviamos la "key" (ej: 'lego1') a la base de datos
        await updateProfile({
            nombre_completo: nombre,
            avatar_url: selectedAvatarKey, 
        });

        Toast.show({ type: 'success', text1: 'Perfil actualizado correctamente' });
        
        // Regresamos después de un segundo
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
        {/* Avatar Principal (Previsualización) */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ position: 'relative' }}>
                <Image 
                    source={getAvatarSource(selectedAvatarKey)} 
                    style={[misc.logo, { marginBottom: 0, borderRadius: 50, width: 100, height: 100 }]} 
                />
            </View>
            <ThemedText style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>{nombre || 'Usuario'}</ThemedText>
        </View>

        {/* ✅ Selector de Avatares Locales */}
        <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
            <ThemedText style={[text.label, { marginBottom: 10 }]}>Elige un avatar</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {AVATAR_KEYS.map((key) => (
                    <TouchableOpacity 
                        key={key} 
                        onPress={() => setSelectedAvatarKey(key)}
                        style={{ 
                            borderWidth: 3, 
                            borderColor: selectedAvatarKey === key ? colors.primary : 'transparent', 
                            borderRadius: 40,
                            padding: 2
                        }}
                    >
                        <Image 
                            source={getAvatarSource(key)} 
                            style={{ width: 60, height: 60, borderRadius: 30 }} 
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
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