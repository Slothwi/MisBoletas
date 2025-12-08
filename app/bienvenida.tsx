import { AppStyles, ThemedText, ThemedView } from "@/components";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity } from "react-native";

export default function Bienvenida() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/login");
  };

  return (
    <ThemedView style={AppStyles.containers.centered}>
      <Image source={require('../assets/images/logoMisBoletas.jpeg')} style={AppStyles.misc.logo} />
      <ThemedText style={AppStyles.text.detailTitle}>¡Bienvenido a la App Mis Boletas!</ThemedText>
      <ThemedText style={[AppStyles.text.cardSubtitle, { marginBottom: AppStyles.spacing.lg }]}>Explora nuestras funcionalidades</ThemedText>
      <TouchableOpacity style={AppStyles.buttons.primary} onPress={() => handlePress()}>
        <ThemedText style={AppStyles.text.buttonText}>Comenzar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}