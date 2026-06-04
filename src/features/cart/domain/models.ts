export interface CartItem {
  id: string
  productoId: string
  productoNombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
}

export interface AddCartItemRequest {
  productoId: string
  cantidad: number
}
