import { http } from '@/core/infrastructure/http/client'
import type { WishlistRepository } from '../domain/ports'
import type { Wishlist } from '../domain/models'

class WishlistService implements WishlistRepository {
  get(): Promise<Wishlist> {
    return http.get<Wishlist>('/api/wishlist')
  }

  addItem(productoId: string): Promise<Wishlist> {
    return http.post<Wishlist>('/api/wishlist/items', { productoId })
  }

  removeItem(itemId: string): Promise<void> {
    return http.delete(`/api/wishlist/items/${itemId}`)
  }
}

export const wishlistService = new WishlistService()
