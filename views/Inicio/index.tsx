import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const inicio = () => {
   const router = useRouter();

   return (
       <View style={{ flex: 1, alignItems: "center" }}>
       <ThemedText type="title" style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
         Tus Productos
       </ThemedText>

       {/* Trajetas de productos */}
       <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} testID='tarjeta-producto-auto' onPress={() => router.push('/')}>
         <View style={styles.cardContent}>
         <MaterialCommunityIcons name="car" size={24} color="#1976d2" />
         <Text style={styles.cardText}>Auto jeep wrangler</Text>
      </View>
        <Ionicons name="chevron-forward" size={24} color="#1976d2" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} testID='tarjeta-producto-lavadora' onPress={() => router.push('/')}>
        <View style={styles.cardContent}>
         <MaterialCommunityIcons name="washing-machine" size={24} color="#1976d2" />
         <Text style={styles.cardText}>Lavadora LG 12 kilos</Text>
        </View>
       <Ionicons name="chevron-forward" size={24} color="#1976d2" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} testID='tarjeta-producto-microondas' onPress={() => router.push('/')}>
        <View style={styles.cardContent}>
         <MaterialCommunityIcons name="microwave" size={24} color="#1976d2" />
         <Text style={styles.cardText}>Microondas Samsung</Text>
        </View>
       <Ionicons name="chevron-forward" size={24} color="#1976d2" />
      </TouchableOpacity>
   </View>
 </View>
 );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#cecacaff',
      padding: 24,
      alignItems: 'center',
    },

    cardsContainer: {
     width: '100%',
     gap: 16,
     },

     card: {
      backgroundColor: '#ffffffff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
 },

    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    
     cardText: {
       color: '#222',
       fontSize: 18,
       fontWeight: '600',
   },
});

export default inicio;