import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/src/components';
// 👇 Importamos los estilos desde el tema global
import { colors, containers, spacing } from '@/src/theme';

const EditarPerfilScreen = () => {
  const router = useRouter();

  return (
    // Reemplazamos AppStyles.containers.page por containers.page
    <View style={containers.page}>
      <View style={containers.centered}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ alignSelf: 'flex-start', padding: spacing.md }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        
        <Ionicons 
          name="construct" 
          size={80} 
          color={colors.primary} 
          style={{ marginTop: spacing.xl }} 
        />
        
        <ThemedText 
          type="title" 
          style={{ 
            fontSize: 24, 
            marginTop: spacing.xl, 
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Editar Perfil
        </ThemedText>

        <ThemedText 
          style={{ 
            fontSize: 16, 
            marginTop: spacing.lg, 
            textAlign: 'center',
            color: '#888'
          }}
        >
          Próximamente
        </ThemedText>
      </View>
    </View>
  );
};

export default EditarPerfilScreen;