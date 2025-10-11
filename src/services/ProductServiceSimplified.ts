import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/config';

// Interfaces para productos (basadas en tu backend real)
export interface Producto {
  ProductoID?: number;
  NombreProducto: string;
  FechaCompra?: string;
  DuracionGarantia?: number;
  Marca?: string;
  Modelo?: string;
  Tienda?: string;
  Notas?: string;
  UsuarioID?: number;
  categorias?: Array<{
    CategoriaID: number;
    NombreCategoria: string;
    Color?: string;
  }>;
}

export interface ProductoCreate {
  NombreProducto: string;
  FechaCompra?: string;
  DuracionGarantia?: number;
  Marca?: string;
  Modelo?: string;
  Tienda?: string;
  Notas?: string;
}

export interface ProductoUpdate {
  NombreProducto?: string;
  FechaCompra?: string;
  DuracionGarantia?: number;
  Marca?: string;
  Modelo?: string;
  Tienda?: string;
  Notas?: string;
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
  async getById(id: number): Promise<Producto> {
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

  // Crear nuevo producto
  async create(productoData: ProductoCreate): Promise<Producto> {
    try {
      console.log('📝 Creating new product:', productoData.NombreProducto);
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
  async update(id: number, productoData: ProductoUpdate): Promise<Producto> {
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
  async delete(id: number): Promise<void> {
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

    if ('NombreProducto' in data && (!data.NombreProducto || data.NombreProducto.trim().length === 0)) {
      errors.push('El nombre del producto es requerido');
    }

    if ('NombreProducto' in data && data.NombreProducto && data.NombreProducto.length > 200) {
      errors.push('El nombre no puede exceder 200 caracteres');
    }

    if (data.Notas && data.Notas.length > 500) {
      errors.push('Las notas no pueden exceder 500 caracteres');
    }

    if (data.DuracionGarantia !== undefined && data.DuracionGarantia < 0) {
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