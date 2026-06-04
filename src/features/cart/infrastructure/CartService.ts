import { http } from '@/core/infrastructure/http/client'
import type { CartRepository } from '../domain/ports'
import type { Cart, AddCartItemRequest } from '../domain/models'

class CartService implements CartRepository {
  get(): Promise<Cart> {
    return http.get<Cart>('/api/cart')
  }

  addItem(data: AddCartItemRequest): Promise<Cart> {
    return http.post<Cart>('/api/cart/items', data)
  }

  removeItem(itemId: string): Promise<void> {
    return http.delete(`/api/cart/items/${itemId}`)
  }

  clear(): Promise<void> {
    return http.delete('/api/cart')
  }
}

export const cartService = new CartService()
