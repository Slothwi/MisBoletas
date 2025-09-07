import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function DetalleConfiguracion() {
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  return (
    <View style={styles.container}>
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
    color: '#1976d2',
    fontFamily: 'Space Mono, monospace',
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
    fontFamily: 'Space Mono, monospace',
    color: '#222',
  },
  value: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Space Mono, monospace',
  },
});