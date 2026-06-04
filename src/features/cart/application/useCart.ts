import { useState, useEffect, useCallback } from 'react'
import { cartService } from '../infrastructure/CartService'
import type { Cart, AddCartItemRequest } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    cartService.get()
      .then(data => { setCart(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  const addItem = async (data: AddCartItemRequest) => {
    const updated = await cartService.addItem(data)
    setCart(updated)
  }

  const removeItem = async (itemId: string) => {
    await cartService.removeItem(itemId)
    await refetch()
  }

  const clearCart = async () => {
    await cartService.clear()
    setCart(null)
  }

  return { cart, loading, error, refetch, addItem, removeItem, clearCart }
}
