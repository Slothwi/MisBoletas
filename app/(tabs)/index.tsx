import { ThemedText } from "@/components/ThemedText";
import {  View } from "react-native";


export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ThemedText type="title" style={{ fontSize: 20, textAlign: "center" }}>
        Tus Productos
      </ThemedText>
    </View>
    
    
  );
}