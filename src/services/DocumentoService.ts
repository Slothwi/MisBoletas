import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';
import * as ImageManipulator from 'expo-image-manipulator';

// Interfaces para documentos
export interface Documento {
  id_documento?: string;
  id?: string;
  documentoid?: number;
  DocumentoID?: number;
  productoid: number;
  ProductoID?: number;
  nombrearchivo: string;
  NombreArchivo?: string;
  url_gcs?: string;
  URL_GCS?: string;
  blob_name: string;
  BlobName?: string;
  content_type?: string;
  ContentType?: string;
  tipo_documento?: string;
  size_bytes?: number;
  SizeBytes?: number;
  fecha_subida: string;
  FechaSubida?: string;
  estado_ocr?: string;
  metadata_ocr?: any;
  numero_boleta?: string;
  fecha_emision?: string;
}

export interface DocumentoUploadResponse {
  message: string;
  documento: Documento;
}

export interface OCRData {
  full_text?: string;
  numero_boleta?: string;
  fecha_emision?: string;
  monto?: string;
  vendedor?: string;
  [key: string]: any;
}

// ✅ NUEVO: Interfaz para respuesta de URL firmada
export interface SignedUrlResponse {
  documento_id: string;
  signed_url: string;
  expires_in_seconds: number;
}

class DocumentoService {
  // ... (MANTENER MÉTODOS EXISTENTES: compressImage, upload, getByProducto, getById, delete, helpers...)

  private async compressImage(uri: string): Promise<string> {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200, height: 1200 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      return uri;
    }
  }

  /**
   * Valida si el tipo de archivo es soportado para OCR
   */
  isValidDocumentType(mimeType?: string, fileName?: string): { valid: boolean; message?: string } {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validPdfType = 'application/pdf';
    
    const type = mimeType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';
    
    // Check MIME type
    if (validImageTypes.includes(type)) return { valid: true };
    if (type === validPdfType) return { valid: true };
    
    // Check file extension
    if (name.match(/\.(jpg|jpeg|png|webp|pdf)$/)) return { valid: true };
    
    return { 
      valid: false, 
      message: 'Archivo no soportado. Solo JPG, PNG, WebP o PDF.' 
    };
  }

  /**
   * Obtiene un nombre amigable para el tipo de documento
   */
  getDocumentTypeName(mimeType?: string): string {
    if (mimeType?.includes('pdf')) return 'PDF';
    if (mimeType?.includes('image')) return 'Imagen';
    return 'Documento';
  }

  async upload(
    productoId: string | number, 
    file: { uri: string; type?: string; name: string }
  ): Promise<DocumentoUploadResponse> {
    const finalUri = file.type?.includes('image') ? await this.compressImage(file.uri) : file.uri;
    const formData = new FormData();
    formData.append('file', {
      uri: finalUri,
      type: file.type || 'image/jpeg',
      name: file.name,
    } as any);

    const url = API_ENDPOINTS.documentos.upload.replace(':productoId', productoId.toString());
    return await apiService.uploadFile<DocumentoUploadResponse>(url, formData);
  }

  /**
   * Envía una imagen al endpoint de OCR "raw" para obtener datos antes de crear el producto.
   * Maneja boletas y facturas en formato JPG, PNG o PDF.
   */
  async procesarOCRPrevia(file: { uri: string; type?: string; name: string }): Promise<OCRData> {
    try {
      // Comprimir solo si es imagen
      const finalUri = file.type?.includes('image') ? await this.compressImage(file.uri) : file.uri;
      
      const formData = new FormData();
      formData.append('file', {
        uri: finalUri,
        type: file.type || 'image/jpeg',
        name: file.name,
      } as any);

      console.log('📤 OCR Previa - Enviando:', { name: file.name, type: file.type });

      // Llamamos al endpoint OCR del backend
      const response = await apiService.uploadFile<{ 
        parsed_data?: OCRData;
        file_name: string;
        message: string;
        ocr_results?: any;
      }>('/ocr/procesar-boleta', formData);

      console.log('✅ Respuesta OCR recibida:', response);

      // Validar estructura de respuesta
      if (!response.parsed_data) {
        console.warn('⚠️ No hay parsed_data en respuesta OCR. Devolviendo respuesta completa.');
        return response as any; // Fallback a respuesta completa
      }

      return response.parsed_data;
    } catch (error: any) {
      console.error('❌ Error en procesarOCRPrevia:', error);
      throw new Error(
        error?.message || 'Error procesando documento con OCR'
      );
    }
  }

  async getByProducto(productoId: string | number): Promise<Documento[]> {
    const url = API_ENDPOINTS.documentos.list.replace(':productoId', productoId.toString());
    return await apiService.get<Documento[]>(url);
  }

  async delete(documentoId: number | string): Promise<void> {
    const url = API_ENDPOINTS.documentos.delete.replace(':documentoId', documentoId.toString());
    await apiService.delete(url);
  }

  // ✅ NUEVO: Obtener URL firmada temporal para ver/descargar archivo
  async getSignedUrl(documentoId: string | number): Promise<string> {
    try {
      console.log('🔐 Solicitando URL firmada para:', documentoId);
      
      // La ruta debe coincidir con backend: /documentos/{id}/signed-url
      const url = `/documentos/${documentoId}/signed-url`;
      const response = await apiService.get<SignedUrlResponse>(url);
      
      if (!response.signed_url) {
        throw new Error('No se recibió URL firmada');
      }

      console.log('✅ URL firmada obtenida correctamente');
      return response.signed_url;
    } catch (error) {
      console.error('❌ Error obteniendo URL firmada:', error);
      throw error;
    }
  }

  // ... (MANTENER MÉTODOS EXISTENTES: formatFileSize, getFileExtension, isImage, getFileIcon, validateFile, uploadAndWaitOCR...)
  // Asegúrate de conservar el resto de la clase tal cual estaba.
}

const documentoService = new DocumentoService();
export default documentoService;
export { DocumentoService };