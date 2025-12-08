import { AppStyles, ThemedText, ThemedTextInput } from '@/components';
import { ticketService } from '@/src/services/TicketService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";

export default function Soporte() {
  const router = useRouter();

  // Estados del formulario
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVolverAConfiguracion = () => {
    router.push('/configuracion_tab');
  };

  const handleLimpiar = () => {
    setAsunto("");
    setMensaje("");
  };

  const handleEnviar = async () => {
    // Validaciones
    if (!asunto.trim()) {
      Alert.alert("Error", "Por favor ingresa un asunto");
      return;
    }

    if (!mensaje.trim()) {
      Alert.alert("Error", "Por favor ingresa tu mensaje");
      return;
    }

    if (asunto.trim().length < 5) {
      Alert.alert("Error", "El asunto debe tener al menos 5 caracteres");
      return;
    }

    if (mensaje.trim().length < 20) {
      Alert.alert("Error", "El mensaje debe tener al menos 20 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Enviando ticket:', { asunto, mensaje });
      await ticketService.createTicket(asunto, mensaje);

      Alert.alert(
        "Éxito",
        "Tu ticket de soporte ha sido creado. Nos pondremos en contacto pronto.",
        [
          {
            text: "OK",
            onPress: () => {
              handleLimpiar();
              router.push('/configuracion_tab');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Error creando ticket:', error);
      Alert.alert(
        "Error",
        error.message || "No se pudo enviar tu ticket. Intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
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

    <ScrollView contentContainerStyle={AppStyles.containers.scrollPageContent}>
      <ThemedText style={[AppStyles.text.detailTitle, { marginBottom: 16 }]}>
        Soporte Técnico
      </ThemedText>
      
      <ThemedText style={[AppStyles.text.cardSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
        ¿Necesitas ayuda con la aplicación?
      </ThemedText>
      
      <ThemedText style={[AppStyles.text.cardSubtitle, { textAlign: 'justify', marginBottom: 24 }]}>
        Completa el formulario para crear un ticket de soporte. Nuestro equipo te responderá a la brevedad.
      </ThemedText>

      <View style={AppStyles.cards.base}>
        <ThemedText style={AppStyles.text.label}>Asunto</ThemedText>
        <ThemedTextInput
          style={AppStyles.inputs.base}
          placeholder="Ej: Problema con garantía"
          value={asunto}
          onChangeText={setAsunto}
          placeholderTextColor="#999"
          editable={!isLoading}
          maxLength={100}
        />
        
        <ThemedText style={[AppStyles.text.helperText, { marginTop: AppStyles.spacing.xs }]}>
          {asunto.length}/100 caracteres
        </ThemedText>

        <View style={{ marginBottom: AppStyles.spacing.md }} />

        <ThemedText style={AppStyles.text.label}>Mensaje</ThemedText>
        <ThemedTextInput
          style={[AppStyles.inputs.base, { minHeight: 120 }]}
          placeholder="Describe tu consulta, queja o problema detalladamente..."
          value={mensaje}
          onChangeText={setMensaje}
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          editable={!isLoading}
          maxLength={500}
        />
        
        <ThemedText style={[AppStyles.text.helperText, { marginTop: AppStyles.spacing.xs }]}>
          {mensaje.length}/500 caracteres
        </ThemedText>

        <View style={{ marginTop: AppStyles.spacing.lg }} />

        <View style={{ flexDirection: 'row', gap: AppStyles.spacing.md }}>
          <TouchableOpacity 
            style={[AppStyles.buttons.secondary, { flex: 1 }]}
            onPress={handleLimpiar}
            disabled={isLoading}
          >
            <ThemedText 
              style={[
                AppStyles.text.buttonText, 
                { color: AppStyles.colors.primary }
              ]}
            >
              Limpiar
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              AppStyles.buttons.primary, 
              { flex: 1 }, 
              isLoading && AppStyles.states.disabled
            ]}
            onPress={handleEnviar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={AppStyles.colors.textLight} size="small" />
            ) : (
              <ThemedText style={AppStyles.text.buttonText}>Enviar Ticket</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={AppStyles.cards.base}>
        <ThemedText style={[AppStyles.text.label, { marginBottom: AppStyles.spacing.md }]}>
          Información importante
        </ThemedText>
        
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: AppStyles.spacing.sm }}>
          <Ionicons name="information-circle" size={20} color={AppStyles.colors.primary} style={{ marginRight: AppStyles.spacing.sm, marginTop: 2 }} />
          <ThemedText style={AppStyles.text.cardText}>
            Responderemos a tu ticket en un plazo máximo de 48 horas hábiles.
          </ThemedText>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: AppStyles.spacing.sm }}>
          <Ionicons name="information-circle" size={20} color={AppStyles.colors.primary} style={{ marginRight: AppStyles.spacing.sm, marginTop: 2 }} />
          <ThemedText style={AppStyles.text.cardText}>
            Asegúrate de proporcionar detalles suficientes para poder ayudarte mejor.
          </ThemedText>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Ionicons name="information-circle" size={20} color={AppStyles.colors.primary} style={{ marginRight: AppStyles.spacing.sm, marginTop: 2 }} />
          <ThemedText style={AppStyles.text.cardText}>
            Puedes adjuntar imágenes o documentos relevantes desde la sección de tickets.
          </ThemedText>
        </View>
      </View>
    </ScrollView>
    </View>
  );
  }