import type { Categoria } from './models'

export interface CategoryRepository {
  list(): Promise<Categoria[]>
  getById(id: string): Promise<Categoria>
  create(data: { nombre: string; descripcion?: string; padreId?: string }): Promise<Categoria>
  update(id: string, data: { nombre: string; descripcion?: string; padreId?: string }): Promise<Categoria>
  delete(id: string): Promise<void>
}
