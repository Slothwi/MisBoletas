import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';

// Interfaces para documentos (basadas en tu backend real)
export interface Documento {
  documentoid?: number;  // Opcional para manejar ambos formatos
  DocumentoID?: number;  // Backend puede devolver en mayúsculas
  productoid: number;
  ProductoID?: number;   // También manejar ProductoID en mayúsculas
  nombrearchivo: string;
  NombreArchivo?: string; // Backend puede devolver en mayúsculas
  url_gcs?: string;       // Minúsculas
  URL_GCS?: string;       // Mayúsculas (backend)
  blob_name: string;
  BlobName?: string;      // Mayúsculas
  content_type?: string;
  ContentType?: string;   // Mayúsculas
  size_bytes?: number;
  SizeBytes?: number;     // Mayúsculas
  fecha_subida: string;
  FechaSubida?: string;   // Mayúsculas
}

export interface DocumentoUploadResponse {
  message: string;
  documento: {
    documentoid: number;
    nombrearchivo: string;
    url_gcs: string;
    content_type: string;
    size_bytes: number;
    fecha_subida: string;
  };
}

class DocumentoService {
  // Subir documento a un producto
  async upload(
    productoId: number, 
    file: { uri: string; type?: string; name: string }
  ): Promise<DocumentoUploadResponse> {
    try {
      console.log('📎 Uploading document for product:', productoId);
      
      // Crear FormData para el upload
      const formData = new FormData();
      
      // En React Native, FormData acepta archivos de esta forma
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg', // Tipo MIME por defecto
        name: file.name,
      } as any);

      const url = API_ENDPOINTS.documentos.upload.replace(':productoId', productoId.toString());
      
      const response = await apiService.uploadFile<DocumentoUploadResponse>(url, formData);
      
      console.log('✅ Document uploaded successfully:', response.documento.nombrearchivo);
      return response;
    } catch (error) {
      console.error('❌ Failed to upload document:', error);
      throw error;
    }
  }

  // Obtener todos los documentos de un producto
  async getByProducto(productoId: number): Promise<Documento[]> {
    try {
      console.log('📎 Fetching documents for product:', productoId);
      
      const url = API_ENDPOINTS.documentos.list.replace(':productoId', productoId.toString());
      const documentos = await apiService.get<Documento[]>(url);
      
      console.log(`✅ ${documentos.length} documents fetched successfully`);
      return documentos;
    } catch (error) {
      console.error('❌ Failed to fetch documents:', error);
      throw error;
    }
  }

  // Obtener un documento específico por ID
  async getById(documentoId: number): Promise<Documento> {
    try {
      console.log('📎 Fetching document by ID:', documentoId);
      
      const url = API_ENDPOINTS.documentos.get.replace(':documentoId', documentoId.toString());
      const documento = await apiService.get<Documento>(url);
      
      console.log('✅ Document fetched successfully');
      return documento;
    } catch (error) {
      console.error('❌ Failed to fetch document:', error);
      throw error;
    }
  }

  // Eliminar documento
  async delete(documentoId: number): Promise<void> {
    try {
      console.log('🗑️ Deleting document:', documentoId);
      
      const url = API_ENDPOINTS.documentos.delete.replace(':documentoId', documentoId.toString());
      await apiService.delete(url);
      
      console.log('✅ Document deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
      throw error;
    }
  }

  // Función auxiliar para formatear el tamaño del archivo
  formatFileSize(bytes?: number): string {
    if (!bytes || bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Función auxiliar para obtener extensión del archivo
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Función auxiliar para determinar si es imagen
  isImage(contentType?: string, filename?: string): boolean {
    if (contentType) {
      return contentType.startsWith('image/');
    }
    
    if (filename) {
      const ext = this.getFileExtension(filename);
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
    }
    
    return false;
  }

  // Función auxiliar para obtener icono según tipo de archivo
  getFileIcon(contentType?: string, filename?: string): string {
    if (this.isImage(contentType, filename)) {
      return 'image';
    }

    if (contentType?.includes('pdf') || filename?.endsWith('.pdf')) {
      return 'file-pdf-box';
    }

    if (contentType?.includes('word') || filename?.match(/\.(doc|docx)$/)) {
      return 'file-word';
    }

    if (contentType?.includes('excel') || filename?.match(/\.(xls|xlsx)$/)) {
      return 'file-excel';
    }

    if (contentType?.includes('text') || filename?.endsWith('.txt')) {
      return 'file-document';
    }

    return 'file';
  }

  // Validar archivo antes de subir
  validateFile(file: { uri: string; size?: number; name: string }): { isValid: boolean; error?: string } {
    // Validar tamaño (máximo 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size && file.size > MAX_SIZE) {
      return {
        isValid: false,
        error: 'El archivo no puede exceder 10MB'
      };
    }

    // Validar nombre
    if (!file.name || file.name.trim().length === 0) {
      return {
        isValid: false,
        error: 'El archivo debe tener un nombre válido'
      };
    }

    // Validar extensión (opcional - permitir todos por ahora)
    const ext = this.getFileExtension(file.name);
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'];
    
    if (ext && !allowedExtensions.includes(ext)) {
      return {
        isValid: false,
        error: `Tipo de archivo no permitido. Usa: ${allowedExtensions.join(', ')}`
      };
    }

    return { isValid: true };
  }
}

// Singleton instance
const documentoService = new DocumentoService();

export default documentoService;
export { DocumentoService };
