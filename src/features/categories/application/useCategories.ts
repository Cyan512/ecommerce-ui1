import { useState, useEffect, useCallback } from 'react'
import { categoryService } from '../infrastructure/CategoryService'
import type { Categoria } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useCategories() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    categoryService.list()
      .then(data => { setCategories(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  return { categories, loading, error, refetch }
}

export function useAdminCategories() {
  const { categories, loading, error, refetch } = useCategories()

  const create = async (data: { nombre: string; descripcion?: string; padreId?: string }) => {
    await categoryService.create(data)
    await refetch()
  }

  const update = async (id: string, data: { nombre: string; descripcion?: string; padreId?: string }) => {
    await categoryService.update(id, data)
    await refetch()
  }

  const remove = async (id: string) => {
    await categoryService.delete(id)
    await refetch()
  }

  return { categories, loading, error, create, update, remove }
}
