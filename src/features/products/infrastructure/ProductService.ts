import { http } from '@/core/infrastructure/http/client'
import type { ProductRepository } from '../domain/ports'
import type { Producto, ProductoRequest } from '../domain/models'

class ProductService implements ProductRepository {
  list(): Promise<Producto[]> {
    return http.get<Producto[]>('/api/products')
  }

  getById(id: string): Promise<Producto> {
    return http.get<Producto>(`/api/products/${id}`)
  }

  listByCategory(categoriaId: string): Promise<Producto[]> {
    return http.get<Producto[]>(`/api/products/by-category/${categoriaId}`)
  }

  create(data: ProductoRequest): Promise<Producto> {
    return http.post<Producto>('/api/admin/products', data)
  }

  update(id: string, data: ProductoRequest): Promise<Producto> {
    return http.put<Producto>(`/api/admin/products/${id}`, data)
  }

  delete(id: string): Promise<void> {
    return http.delete(`/api/admin/products/${id}`)
  }

  uploadImage(id: string, file: File): Promise<Producto> {
    const formData = new FormData()
    formData.append('file', file)
    return http.upload<Producto>(`/api/admin/products/${id}/image`, formData)
  }
}

export const productService = new ProductService()
