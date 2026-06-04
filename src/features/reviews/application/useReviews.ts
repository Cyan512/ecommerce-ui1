import { useState, useEffect, useCallback } from 'react'
import { reviewService } from '../infrastructure/ReviewService'
import type { Resenia, ReseniaRequest } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useReviews(productoId: string) {
  const [reviews, setReviews] = useState<Resenia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    reviewService.listByProduct(productoId)
      .then(data => { setReviews(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [productoId, key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  const create = async (data: ReseniaRequest) => {
    await reviewService.create(data)
    await refetch()
  }

  const remove = async (id: string) => {
    await reviewService.delete(id)
    await refetch()
  }

  return { reviews, loading, error, create, remove }
}
