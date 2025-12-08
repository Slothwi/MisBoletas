import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';

// Interfaces para productos (Supabase schema)
export interface Producto {
  id_producto: string;  // Cambio: Era "ProductoID: number" → Ahora UUID string
  id_usuario: string;   // Cambio: Era "UsuarioID: number" → Ahora UUID string
  nombre: string;       // Cambio: Era "NombreProducto" → Ahora "nombre"
  fecha_compra?: string;
  duracion_garantia_meses?: number; // Cambio: Era "DuracionGarantia" → Ahora "duracion_garantia_meses"
  marca?: string;
  modelo?: string;
  tienda?: string;
  notas?: string;
  precio?: number;
  fecha_creacion?: string;
  categorias?: {
    id_categoria: string;  // Cambio: Era "CategoriaID: number" → Ahora UUID string
    nombre: string;        // Cambio: Era "NombreCategoria" → Ahora "nombre"
    color?: string;
  }[];
}

export interface ProductoCreate {
  nombre: string;       // Cambio: Era "NombreProducto" → Ahora "nombre"
  fecha_compra?: string;
  duracion_garantia_meses?: number; // Cambio: Era "DuracionGarantia" → Ahora "duracion_garantia_meses"
  marca?: string;
  modelo?: string;
  tienda?: string;
  notas?: string;
  precio?: number;
  categoria_ids?: string[]; // Cambio: Agregar categorías (array de UUIDs)
}

export interface ProductoUpdate {
  nombre?: string;      // Cambio: Era "NombreProducto?" → Ahora "nombre?"
  fecha_compra?: string;
  duracion_garantia_meses?: number; // Cambio: Era "DuracionGarantia?" → Ahora "duracion_garantia_meses?"
  marca?: string;
  modelo?: string;
  tienda?: string;
  notas?: string;
  precio?: number;
}

class ProductoService {
  // Obtener todos los productos del usuario
  async getAll(): Promise<Producto[]> {
    try {
      console.log('📦 Fetching user products');
      const productos = await apiService.get<Producto[]>(API_ENDPOINTS.productos.list);
      console.log(`✅ ${productos.length} products fetched successfully`);
      return productos;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async getById(id: string): Promise<Producto> { // Cambio: Era "id: number" → Ahora "id: string" (UUID)
    try {
      console.log('📦 Fetching product by ID:', id);
      const producto = await apiService.get<Producto>(`${API_ENDPOINTS.productos.list}${id}`);
      console.log('✅ Product fetched successfully');
      return producto;
    } catch (error) {
      console.error('❌ Failed to fetch product:', error);
      throw error;
    }
  }

  // Obtener productos por categoría
  async getByCategory(categoryId: string): Promise<Producto[]> {
    try {
      console.log('📦 Fetching products by category:', categoryId);
      const productos = await apiService.get<Producto[]>(`${API_ENDPOINTS.productos.list}?categoria=${categoryId}`);
      console.log(`✅ ${productos.length} products found for category`);
      return productos;
    } catch (error) {
      console.error('❌ Failed to fetch products by category:', error);
      throw error;
    }
  }

  // Crear nuevo producto
  async create(productoData: ProductoCreate): Promise<Producto> {
    try {
      console.log('📝 Creating new product:', productoData.nombre); // Cambio: Era "productoData.NombreProducto" → Ahora "productoData.nombre"
      const producto = await apiService.post<Producto>(
        API_ENDPOINTS.productos.create,
        productoData
      );
      console.log('✅ Product created successfully');
      return producto;
    } catch (error) {
      console.error('❌ Failed to create product:', error);
      throw error;
    }
  }

  // Actualizar producto
  async update(id: string | number, productoData: ProductoUpdate): Promise<Producto> {
    try {
      console.log('📝 Updating product:', id);
      const producto = await apiService.put<Producto>(
        `${API_ENDPOINTS.productos.update}${id}`,
        productoData
      );
      console.log('✅ Product updated successfully');
      return producto;
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      throw error;
    }
  }

  // Eliminar producto
  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting product:', id);
      await apiService.delete(`${API_ENDPOINTS.productos.delete}${id}`);
      console.log('✅ Product deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete product:', error);
      throw error;
    }
  }

  // Validar datos de producto
  validateProductoData(data: ProductoCreate | ProductoUpdate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('nombre' in data && (!data.nombre || data.nombre.trim().length === 0)) {
      errors.push('El nombre del producto es requerido');
    }

    if ('nombre' in data && data.nombre && data.nombre.length > 200) {
      errors.push('El nombre no puede exceder 200 caracteres');
    }

    if (data.notas && data.notas.length > 500) {
      errors.push('Las notas no pueden exceder 500 caracteres');
    }

    if (data.duracion_garantia_meses !== undefined && data.duracion_garantia_meses < 0) {
      errors.push('La duración de garantía no puede ser negativa');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Función auxiliar para mostrar iconos según el tipo de producto
  getProductIcon(nombre: string): string {
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes('auto') || nombreLower.includes('carro') || nombreLower.includes('vehículo')) {
      return 'car';
    }
    if (nombreLower.includes('lavadora')) {
      return 'washing-machine';
    }
    if (nombreLower.includes('microondas')) {
      return 'microwave';
    }
    if (nombreLower.includes('televisor') || nombreLower.includes('tv')) {
      return 'television';
    }
    if (nombreLower.includes('celular') || nombreLower.includes('teléfono') || nombreLower.includes('smartphone')) {
      return 'cellphone';
    }
    if (nombreLower.includes('laptop') || nombreLower.includes('computadora') || nombreLower.includes('pc')) {
      return 'laptop';
    }
    if (nombreLower.includes('refrigerador') || nombreLower.includes('nevera')) {
      return 'fridge';
    }
    
    // Icono por defecto
    return 'package-variant';
  }
}

// Singleton instance
const productoService = new ProductoService();

export default productoService;
export { ProductoService };