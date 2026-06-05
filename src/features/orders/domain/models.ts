export interface PedidoItem {
  productoId: string
  productoNombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Pedido {
  id: string
  estado: string
  total: number
  descuento?: number
  subtotal?: number
  fechaCreacion: string
  items?: PedidoItem[]
}

export interface CreatePedidoRequest {
  direccionId?: string
  cuponCodigo?: string
  items: { productoId: string; cantidad: number }[]
}

export interface UpdatePedidoStatusRequest {
  estado: string
}
