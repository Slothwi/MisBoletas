import { ThemedText } from "@/src/components";
// 👇 IMPORTANTE: Importamos los estilos del tema nuevo
import { cards, colors, containers, misc, text } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';

export default function DetalleConfiguracionScreen() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  return (
    // ✅ Usamos containers.page en vez de AppStyles.containers.page
    <View style={containers.page}>
      <TouchableOpacity 
        style={misc.backButton}
        onPress={handleVolverAConfiguracion}
      >
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <ThemedText style={misc.backButtonText}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>

      <ThemedText style={[text.detailTitle, { marginBottom: 24 }]}>Configuraciones</ThemedText>
      
      <View style={cards.interactive}>
        <ThemedText style={text.cardText}>Notificaciones</ThemedText>
        <View style={misc.linkCard}>
        <Switch
          value={notificaciones}
          onValueChange={setNotificaciones}
        />
        </View>
      </View>
      
      <View style={cards.interactive}>
        <ThemedText style={text.cardText}>Tema oscuro</ThemedText>
        <View style={misc.linkCard}>
        <Switch
          value={temaOscuro}
          onValueChange={setTemaOscuro}
        />
        </View>
      </View>
      
      <View style={cards.interactive}>
        <ThemedText style={text.cardText}>Idioma</ThemedText>
        <ThemedText style={text.cardSubtitle}>Español</ThemedText>
      </View>
    </View>
  );
}