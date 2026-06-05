import type { Producto, ProductoRequest } from './models'

export interface ProductRepository {
  list(): Promise<Producto[]>
  getById(id: string): Promise<Producto>
  listByCategory(categoriaId: string): Promise<Producto[]>
  create(data: ProductoRequest): Promise<Producto>
  update(id: string, data: ProductoRequest): Promise<Producto>
  delete(id: string): Promise<void>
  uploadImage(id: string, file: File): Promise<Producto>
}
