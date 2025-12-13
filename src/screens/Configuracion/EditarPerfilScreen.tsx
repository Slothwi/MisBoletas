import { ThemedText, ThemedTextInput, ThemedView } from '@/src/components';
import { useAuth } from '@/src/hooks/useAuth';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { buttons, cards, colors, containers, inputs, misc, spacing, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';

const EditarPerfilScreen = () => {
  const router = useRouter();
  const { authState } = useAuth(); // Obtenemos datos del usuario real
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;

  // Datos iniciales desde authState
  const [nombre, setNombre] = useState(authState.user?.nombre_completo || '');
  const [email, setEmail] = useState(authState.user?.email || '');
  const [telefono, setTelefono] = useState('');

  const handleGuardar = () => {
    // Aquí iría la lógica para actualizar en el backend (PUT /users/profile)
    // Por ahora simulamos éxito
    Alert.alert("Perfil Actualizado", "Tus datos han sido guardados correctamente.", [
        { text: "OK", onPress: () => router.back() }
    ]);
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
                    source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                    style={[misc.logo, { marginBottom: 0 }]} 
                />
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, padding: 8, borderRadius: 20 }}>
                    <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <ThemedText style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>{authState.user?.nombre_completo || 'Usuario'}</ThemedText>
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
                />
            </View>

            <View style={inputs.container}>
                <ThemedText style={text.label}>Correo Electrónico</ThemedText>
                <ThemedTextInput 
                    style={[inputs.base, { backgroundColor: isDark ? colors.cardDark : '#eee', color: isDark ? '#aaa' : '#666' }]} 
                    value={email} 
                    editable={false} // El correo suele ser no editable
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
                />
            </View>

            <TouchableOpacity style={[buttons.primary, { marginTop: 20 }]} onPress={handleGuardar}>
                <ThemedText style={text.buttonText}>Guardar Cambios</ThemedText>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default EditarPerfilScreen;