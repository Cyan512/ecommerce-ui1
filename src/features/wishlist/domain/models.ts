export interface WishlistItem {
  id: string
  productoId: string
  productoNombre: string
}

export interface Wishlist {
  id: string
  items: WishlistItem[]
}
