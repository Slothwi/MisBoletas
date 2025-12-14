import { ThemedText, ThemedView } from '@/src/components';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import productoService, { Producto } from '@/src/services/ProductServiceSimplified';
import { buttons, cards, colors, containers, misc, spacing, text } from '@/src/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const HistorialScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const cardBg = isDark ? colors.cardDark : colors.primaryLight;

  const [eliminados, setEliminados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (lógica cargarHistorial y handleRestaurar se mantienen igual) ...
  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const data = await productoService.getDeleted();
      setEliminados(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleRestaurar = (producto: Producto) => {
      // ... tu lógica aquí ...
      Alert.alert("Restaurar", "...", [{ text: "OK", onPress: () => {} }]); // Simplificado para brevedad
  };

  useEffect(() => { cargarHistorial(); }, []);

  return (
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
      
      {/* ✅ HEADER CORREGIDO */}
      <View style={{ paddingTop: 10, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 40 }}>
          <Ionicons name="arrow-back" size={26} color={colors.primary} />
        </TouchableOpacity>
        
        <ThemedText style={[text.detailTitle, { marginTop: 0, marginBottom: 0, flex: 1, marginHorizontal: 0, textAlign: 'center' }]}>
            Papelera
        </ThemedText>

        <View style={{ width: 40 }} />
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : eliminados.length === 0 ? (
        <View style={containers.centered}>
          <MaterialCommunityIcons name="delete-empty" size={64} color="#888" />
          <ThemedText style={{ marginTop: 20, color: '#888' }}>La papelera está vacía</ThemedText>
        </View>
      ) : (
        <FlatList
            style={{ width: '100%' }}
            data={eliminados}
            keyExtractor={(item) => item.id_producto || Math.random().toString()}
            renderItem={({ item }) => (
            <View style={[cards.base, { backgroundColor: cardBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flex: 1 }}>
                    <ThemedText style={[text.cardText, { textDecorationLine: 'line-through', color: '#888' }]}>
                    {item.nombre}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#888' }}>
                  Eliminado: {item.fecha_eliminacion ? new Date(item.fecha_eliminacion).toLocaleDateString() : 'N/A'}
                </ThemedText>
              </View>
              
              <TouchableOpacity 
                style={{ backgroundColor: colors.secondary, padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => handleRestaurar(item)}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <ThemedText style={{ color: '#fff', marginLeft: 4, fontSize: 12, fontWeight: 'bold' }}>Restaurar</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
};

export default HistorialScreen;