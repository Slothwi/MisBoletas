// 👇 Importamos los componentes
import { ThemedText, ThemedView } from "@/src/components";
// 👇 IMPORTANTE: Importamos los estilos individuales del tema
import { buttons, containers, misc, text } from "@/src/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity } from "react-native";

export default function BienvenidaScreen() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/(auth)/login"); // Asegúrate de que la ruta sea correcta
  };

  return (
    // ❌ Antes: AppStyles.containers.centered
    // ✅ Ahora: containers.centered
    <ThemedView style={containers.centered}>
      <Image 
        source={require('@/assets/images/logoMisBoletas.jpeg')} 
        style={misc.logo} // ✅ misc.logo
      />
      
      <ThemedText style={text.detailTitle}>
        ¡Bienvenido a la App Mis Boletas!
      </ThemedText>
      
      <ThemedText style={[text.cardSubtitle, { marginBottom: 16 }]}>
        Explora nuestras funcionalidades
      </ThemedText>
      
      <TouchableOpacity style={buttons.primary} onPress={() => handlePress()}>
        <ThemedText style={text.buttonText}>Comenzar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}