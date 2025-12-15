import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components';
import { colors, buttons, containers, text, spacing } from '@/src/theme';
import documentoService from '@/src/services/DocumentoService';
import Toast from 'react-native-toast-message';

const EscanearScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // Validar tipo de archivo soportado
  const isValidFileType = (mimeType?: string, name?: string): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validPdfType = 'application/pdf';
    
    const type = mimeType?.toLowerCase() || '';
    const fileName = name?.toLowerCase() || '';
    
    if (validImageTypes.includes(type)) return true;
    if (type === validPdfType) return true;
    if (fileName.match(/\.(jpg|jpeg|png|webp|pdf)$/)) return true;
    
    return false;
  };

  const procesarArchivo = async (asset: any) => {
    // Validar antes de procesar
    if (!isValidFileType(asset.mimeType || asset.type, asset.fileName || asset.name)) {
      Alert.alert('Formato no soportado', 'Solo se aceptan JPG, PNG, WebP o PDF.');
      return;
    }

    setLoading(true);
    setPreviewUri(null);

    try {
      console.log('📤 Procesando archivo:', asset.name || asset.fileName);
      
      const ocrData = await documentoService.procesarOCRPrevia({
        uri: asset.uri,
        name: asset.fileName || asset.name || 'documento.jpg',
        type: asset.mimeType || asset.type || 'image/jpeg'
      });

      console.log('✅ OCR completado:', ocrData);

      if (!ocrData || typeof ocrData !== 'object') {
        throw new Error('Respuesta OCR inválida');
      }

      // Navegar al formulario con los datos extraídos
      router.push({
        pathname: '/formulario',
        params: {
          ocrData: JSON.stringify(ocrData),
          imagenTemporalUri: asset.uri
        }
      });

      Toast.show({
        type: 'success',
        text1: '✅ Boleta analizada',
        text2: 'Completa los datos en el formulario'
      });

    } catch (error: any) {
      console.error('❌ Error OCR:', error);
      
      const mensajeError = error?.message?.includes('400') 
        ? 'No se pudo leer el documento. Intenta con otra imagen.' 
        : 'Error procesando documento. Intenta ingresarlo manualmente.';
      
      Alert.alert('Error', mensajeError, [
        { text: 'Intentar otra', style: 'cancel' },
        { text: 'Ingresar manual', onPress: () => router.push('/formulario') }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setPreviewUri(result.assets[0].uri);
        procesarArchivo(result.assets[0]);
      }
    } catch (error) {
      console.error('Error cámara:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const subirArchivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setPreviewUri(result.assets[0].uri);
        procesarArchivo(result.assets[0]);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  return (
    <ThemedView style={[containers.page, { backgroundColor: '#fff' }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        
        {/* Encabezado */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Ionicons name="receipt" size={64} color={colors.primary} style={{ marginBottom: 16 }} />
          <ThemedText style={[text.detailTitle, { textAlign: 'center', marginTop: 0, marginBottom: 8 }]}>
            Escanear Boleta o Factura
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            Toma una foto o sube un archivo (JPG, PNG, PDF)
          </ThemedText>
        </View>

        {loading ? (
          /* Estado Cargando */
          <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 20 }} />
            <ThemedText style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
              Analizando documento con IA...
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              Esto puede tomar unos segundos
            </ThemedText>
          </View>
        ) : (
          /* Opciones */
          <View style={{ gap: 16 }}>
            {/* Botón Tomar Foto */}
            <TouchableOpacity 
              style={[buttons.primary, { paddingVertical: 16 }]} 
              onPress={tomarFoto}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="camera" size={24} color="#fff" style={{ marginRight: 12 }} />
                <View>
                  <ThemedText style={[text.buttonText, { margin: 0 }]}>
                    Tomar Foto
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                    Captura con tu cámara
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
              <ThemedText style={{ color: '#999', fontSize: 12 }}>o</ThemedText>
              <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
            </View>

            {/* Botón Subir Archivo */}
            <TouchableOpacity 
              style={[buttons.secondary, { paddingVertical: 16, borderWidth: 2, borderColor: colors.primary }]} 
              onPress={subirArchivo}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="cloud-upload" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <ThemedText style={{ color: colors.primary, fontWeight: '700', margin: 0 }}>
                    Subir Archivo
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, color: colors.primary, marginTop: 2, opacity: 0.7 }}>
                    JPG, PNG o PDF
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>

            {/* Opción Manual */}
            <TouchableOpacity 
              onPress={() => router.push('/formulario')} 
              style={{ marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}
            >
              <ThemedText style={{ textAlign: 'center', color: '#888', fontWeight: '500' }}>
                Ingresar datos manualmente
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer con tips */}
        {!loading && (
          <View style={{ marginTop: 40, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' }}>
            <ThemedText style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: '600' }}>
              💡 Tips para mejores resultados:
            </ThemedText>
            <ThemedText style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
              • Asegúrate buena iluminación
            </ThemedText>
            <ThemedText style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
              • Centra el documento en la foto
            </ThemedText>
            <ThemedText style={{ fontSize: 11, color: '#999' }}>
              • Evita sombras y reflejos
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default EscanearScreen;
