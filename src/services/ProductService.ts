// src/services/ProductService.ts

import { api } from './api';

export interface Product {
  id: string;
  name: string;
  purchaseDate: string;
  warranty: number;
  brand: string;
  model: string;
  store: string;
  notes?: string;
  fileUrl?: string;
}

export const ProductService = {
  async getProducts() {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async createProduct(product: Omit<Product, 'id'>) {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: string) {
    await api.delete(`/products/${id}`);
  },
};