import React from 'react';
import { StyleSheet, Switch, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';

export default function DetalleConfiguracion() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.botonVolver}
        onPress={handleVolverAConfiguracion}
      >
        <Ionicons name="arrow-back" size={24} color="#e77573" />
        <ThemedText style={styles.botonVolverTexto}>Volver a configuraciones</ThemedText>
      </TouchableOpacity>

      <Text style={styles.title}>Configuraciones</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Notificaciones</Text>
        <Switch
          value={notificaciones}
          onValueChange={setNotificaciones}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Tema oscuro</Text>
        <Switch
          value={temaOscuro}
          onValueChange={setTemaOscuro}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Idioma</Text>
        <Text style={styles.value}>Español</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#e77573',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  botonVolverTexto: {
    color: '#e77573',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});