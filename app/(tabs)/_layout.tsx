import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Colors } from '@/src/theme/colors'; // 👈 Importamos el tema centralizado
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Obtenemos los colores del tema actual (light o dark)
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        // Usamos las variables del tema
        tabBarActiveTintColor: themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          // Tab bar siempre blanca
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
        },
      }}
      initialRouteName="home">

      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'list' : 'list-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracion_tab"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
        }}
      />

    </Tabs>
  );
}