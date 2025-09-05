import { ThemedText } from "@/components/ThemedText";
import { View, Button } from "react-native";


export default function HomeScreen() {
  return (
    
    <View style={{ flex: 1, alignItems: "center" }}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
        Tus Categorías
      </ThemedText>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row", marginBottom: 40 }}>
        <View style={{ marginHorizontal: 40 }}>
          <Button title="Eliminar"  />
        </View>
        <View style={{ marginHorizontal: 40 }}>
          <Button title="Crear"  />
        </View>
      </View>
    </View>
  );
}