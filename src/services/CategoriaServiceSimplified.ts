import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';

// Debug: Verificar que los endpoints estén disponibles
console.log('🔧 [CategoriaService] API_ENDPOINTS.categorias:', API_ENDPOINTS.categorias);
console.log('🔧 [CategoriaService] API_ENDPOINTS.categorias.list:', API_ENDPOINTS.categorias.list);

// Interfaces para categorías (Supabase schema)
export interface Categoria {
  id_categoria: string;
  id_usuario: string;
  nombre: string;
  color: string;
  fecha_creacion?: string;
  // ✅ ESTA ES LA LÍNEA QUE TE FALTA 👇
  numero_productos?: number; 
}

export interface CategoriaCreate {
  nombre: string;
  color: string;
}

export interface CategoriaUpdate {
  nombre?: string;
  color?: string;
}

// Esta interfaz ya no es estrictamente necesaria si usas la de arriba, 
// pero la dejamos por compatibilidad.
export interface CategoriaWithProducts extends Categoria {
  total_productos: number; 
}

// Colores predefinidos que coinciden con el backend
export const PREDEFINED_COLORS = {
  "azul": "#007BFF",
  "verde": "#28A745", 
  "rojo": "#DC3545",
  "amarillo": "#FFC107",
  "naranja": "#FD7E14",
  "morado": "#6F42C1",
  "rosa": "#E83E8C",
  "gris": "#6C757D",
  "negro": "#000000",
  "blanco": "#FFFFFF",
  "celeste": "#17A2B8",
  "lima": "#20C997"
};

class CategoriaServiceSimplified {
  // Obtener todas las categorías del usuario
  async getAll(): Promise<Categoria[]> {
    console.log('📂 [CategoriaService] === STARTING getAll ===');
    
    try {
      const endpoint = API_ENDPOINTS.categorias.list;
      
      if (!endpoint) {
        throw new Error('Endpoint no definido para categorías');
      }
      
      // El backend ahora enviará objetos con "numero_productos" incluido
      const categorias = await apiService.get<Categoria[]>(endpoint);
      
      if (!Array.isArray(categorias)) {
        console.warn('⚠️ [CategoriaService] Response is not array, converting...');
        return [];
      }
      
      return categorias;
      
    } catch (error: any) {
      console.error('❌ [CategoriaService] Error loading categories:', error);
      const message = error.message || 'Error desconocido al cargar categorías';
      throw new Error(message);
    }
  }

  // Obtener categoría por ID
  async getById(id: string): Promise<Categoria> {
    try {
      const categoria = await apiService.get<Categoria>(`${API_ENDPOINTS.categorias.list}/${id}`);
      return categoria;
    } catch (error) {
      console.error('❌ Failed to fetch category:', error);
      throw error;
    }
  }

  // Crear nueva categoría
  async create(categoriaData: CategoriaCreate): Promise<Categoria> {
    try {
      const categoria = await apiService.post<Categoria>(
        API_ENDPOINTS.categorias.create,
        categoriaData
      );
      return categoria;
    } catch (error: any) {
      console.error('❌ Failed to create category:', error);
      
      let message = 'Error creando categoría';
      if (error.type === 'NETWORK_ERROR') {
        message = 'No se puede conectar al servidor. Verifica tu conexión.';
      } else if (error.status === 401) {
        message = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (error.status === 403) {
        message = 'No tienes permisos para crear categorías.';
      } else if (error.status === 400) {
        message = 'Datos inválidos. Verifica el nombre de la categoría.';
      } else if (error.message) {
        message = error.message;
      }
      
      throw new Error(message);
    }
  }

  // Actualizar categoría
  async update(id: string, categoriaData: CategoriaUpdate): Promise<Categoria> {
    try {
      const categoria = await apiService.put<Categoria>(
        `${API_ENDPOINTS.categorias.update}/${id}`,
        categoriaData
      );
      return categoria;
    } catch (error) {
      console.error('❌ Failed to update category:', error);
      throw error;
    }
  }

  // Eliminar categoría
  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${API_ENDPOINTS.categorias.delete}/${id}`);
    } catch (error) {
      console.error('❌ Failed to delete category:', error);
      throw error;
    }
  }

  // Validar datos de categoría
  validateCategoriaData(data: CategoriaCreate | CategoriaUpdate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('nombre' in data && (!data.nombre || data.nombre.trim().length === 0)) {
      errors.push('El nombre de la categoría es requerido');
    }

    if ('nombre' in data && data.nombre && data.nombre.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    if ('color' in data && data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
      errors.push('El color debe ser un código hexadecimal válido (ej: #FF0000)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Obtener color aleatorio
  getRandomColor(): string {
    const colors = Object.values(PREDEFINED_COLORS);
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Obtener colores disponibles
  getAvailableColors(): {name: string, value: string}[] {
    return Object.entries(PREDEFINED_COLORS).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }
}

const categoriaServiceSimplified = new CategoriaServiceSimplified();

export default categoriaServiceSimplified;
export { CategoriaServiceSimplified };