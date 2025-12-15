import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components';
import { colors, buttons, containers, text } from '@/src/theme';
import documentoService from '@/src/services/DocumentoService';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '@/src/hooks/useColorScheme';

const EscanearScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setPreviewUri] = useState<string | null>(null);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#444';
  const subTextColor = isDark ? '#94a3b8' : '#666';
  const borderColor = isDark ? '#334155' : '#ddd';

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

      if (!ocrData || typeof ocrData !== 'object') {
        throw new Error('Respuesta OCR inválida');
      }

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
    <ThemedView style={[containers.page, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>

        <View style={{ paddingTop: 10, paddingHorizontal: 16, alignItems: 'flex-start' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                <Ionicons name="arrow-back" size={26} color={colors.primary} />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        {/* ... el resto de tu código (View estilo tarjeta, etc) ... */}
        
        <View style={{ 
            backgroundColor: cardBg, 
            borderRadius: 24, 
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 10,
            elevation: 5
        }}>
            
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <View style={{ 
                    backgroundColor: isDark ? 'rgba(231, 117, 115, 0.2)' : '#ffe4e3', 
                    padding: 16, 
                    borderRadius: 50,
                    marginBottom: 16
                }}>
                    <Ionicons name="scan" size={48} color={colors.primary} />
                </View>
                
                <ThemedText style={[text.detailTitle, { textAlign: 'center', marginTop: 0, marginBottom: 8, color: isDark ? '#fff' : colors.textDark }]}>
                    Escanear Boleta
                </ThemedText>
                <ThemedText style={{ fontSize: 14, color: subTextColor, textAlign: 'center', lineHeight: 20 }}>
                    Toma una foto clara o sube un archivo (PDF/JPG) para autocompletar los datos.
                </ThemedText>
            </View>

            {loading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
                <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 20 }} />
                <ThemedText style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', color: textColor }}>
                Analizando documento...
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: subTextColor, marginTop: 8 }}>
                Nuestra IA está leyendo los datos
                </ThemedText>
            </View>
            ) : (
            <View style={{ gap: 16 }}>
                
                {/* Botón Tomar Foto - ALINEADO Y CENTRADO */}
                <TouchableOpacity 
                    style={[buttons.primary, { paddingVertical: 16 }]} 
                    onPress={tomarFoto}
                    activeOpacity={0.8}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="camera" size={24} color="#fff" style={{ marginRight: 12 }} />
                        <ThemedText style={[text.buttonText, { margin: 0, textAlign: 'center' }]}>
                            Tomar Foto
                        </ThemedText>
                    </View>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
                    <ThemedText style={{ color: subTextColor, fontSize: 12 }}>o</ThemedText>
                    <View style={{ flex: 1, height: 1, backgroundColor: borderColor }} />
                </View>

                {/* Botón Subir Archivo - FONDO BLANCO Y ALINEADO */}
                <TouchableOpacity 
                    style={[buttons.secondary, { 
                        paddingVertical: 16, 
                        borderWidth: 2, 
                        borderColor: colors.primary,
                        backgroundColor: '#ffffff' // ✅ Fondo Blanco
                    }]} 
                    onPress={subirArchivo}
                    activeOpacity={0.8}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                        <ThemedText style={{ color: colors.primary, fontWeight: '700', margin: 0, textAlign: 'center' }}>
                            Subir Archivo
                        </ThemedText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => router.push('/formulario')} 
                    style={{ 
                        marginTop: 8, 
                        paddingVertical: 14, 
                        borderRadius: 12, 
                        backgroundColor: isDark ? '#334155' : '#f3f4f6'
                    }}
                >
                    <ThemedText style={{ textAlign: 'center', color: subTextColor, fontWeight: '500', fontSize: 14 }}>
                        Ingresar datos manualmente
                    </ThemedText>
                </TouchableOpacity>
            </View>
            )}

            {!loading && (
            <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: borderColor }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="bulb-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                    <ThemedText style={{ fontSize: 12, color: textColor, fontWeight: '600' }}>
                    Tips para mejores resultados:
                    </ThemedText>
                </View>
                <ThemedText style={{ fontSize: 11, color: subTextColor, marginBottom: 4 }}>• Busca buena iluminación.</ThemedText>
                <ThemedText style={{ fontSize: 11, color: subTextColor }}>• Evita sombras sobre el texto.</ThemedText>
            </View>
            )}
        </View>

      </ScrollView>
    </ThemedView>
  );
};

export default EscanearScreen;