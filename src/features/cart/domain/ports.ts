import type { Cart, AddCartItemRequest } from './models'

export interface CartRepository {
  get(): Promise<Cart>
  addItem(data: AddCartItemRequest): Promise<Cart>
  removeItem(itemId: string): Promise<void>
  clear(): Promise<void>
}
