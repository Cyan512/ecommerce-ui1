export interface Resenia {
  id: string
  usuarioId: string
  usuarioNombre: string
  productoId: string
  calificacion: number
  comentario?: string
  fecha: string
}

export interface ReseniaRequest {
  productoId: string
  calificacion: number
  comentario?: string
}
