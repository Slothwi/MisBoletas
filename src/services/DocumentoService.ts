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