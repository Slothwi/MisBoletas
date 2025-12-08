import { AppStyles, ThemedText } from "@/components";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Switch, TouchableOpacity, View } from 'react-native';

export default function DetalleConfiguracion() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  return (
    <View style={AppStyles.containers.page}>
      <TouchableOpacity 
        style={AppStyles.misc.backButton}
        onPress={handleVolverAConfiguracion}
      >
        <Ionicons name="arrow-back" size={24} color={AppStyles.colors.primary} />
        <ThemedText style={AppStyles.misc.backButtonText}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>

      <ThemedText style={[AppStyles.text.detailTitle, { marginBottom: 24 }]}>Configuraciones</ThemedText>
      <View style={AppStyles.cards.interactive}>
        <ThemedText style={AppStyles.text.cardText}>Notificaciones</ThemedText>
        <View style={AppStyles.misc.linkCard}>
        <Switch
          value={notificaciones}
          onValueChange={setNotificaciones}
        />
        </View>
      </View>
      <View style={AppStyles.cards.interactive}>
        <ThemedText style={AppStyles.text.cardText}>Tema oscuro</ThemedText>
        <View style={AppStyles.misc.linkCard}>
        <Switch
          value={temaOscuro}
          onValueChange={setTemaOscuro}
        />
        </View>
      </View>
      <View style={AppStyles.cards.interactive}>
        <ThemedText style={AppStyles.text.cardText}>Idioma</ThemedText>
        <ThemedText style={AppStyles.text.cardSubtitle}>Español</ThemedText>
      </View>
    </View>
  );
}