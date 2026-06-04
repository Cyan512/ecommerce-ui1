export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  categoriaId?: string
  imagenUrl?: string
  activo: boolean
}

export interface ProductoRequest {
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  categoriaId?: string
  imagenUrl?: string
}
