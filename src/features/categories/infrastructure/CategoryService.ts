import { http } from '@/core/infrastructure/http/client'
import type { CategoryRepository } from '../domain/ports'
import type { Categoria } from '../domain/models'

class CategoryService implements CategoryRepository {
  list(): Promise<Categoria[]> {
    return http.get<Categoria[]>('/api/categories')
  }

  getById(id: string): Promise<Categoria> {
    return http.get<Categoria>(`/api/categories/${id}`)
  }

  create(data: { nombre: string; descripcion?: string; padreId?: string }): Promise<Categoria> {
    return http.post<Categoria>('/api/admin/categories', data)
  }

  update(id: string, data: { nombre: string; descripcion?: string; padreId?: string }): Promise<Categoria> {
    return http.put<Categoria>(`/api/admin/categories/${id}`, data)
  }

  delete(id: string): Promise<void> {
    return http.delete(`/api/admin/categories/${id}`)
  }
}

export const categoryService = new CategoryService()
