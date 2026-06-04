import { useState, useEffect, useCallback } from 'react'
import { wishlistService } from '../infrastructure/WishlistService'
import type { Wishlist } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    wishlistService.get()
      .then(data => { setWishlist(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  const addItem = async (productoId: string) => {
    const updated = await wishlistService.addItem(productoId)
    setWishlist(updated)
  }

  const removeItem = async (itemId: string) => {
    await wishlistService.removeItem(itemId)
    await refetch()
  }

  return { wishlist, loading, error, refetch, addItem, removeItem }
}
