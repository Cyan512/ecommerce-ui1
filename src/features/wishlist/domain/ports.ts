import type { Wishlist } from './models'

export interface WishlistRepository {
  get(): Promise<Wishlist>
  addItem(productoId: string): Promise<Wishlist>
  removeItem(itemId: string): Promise<void>
}
