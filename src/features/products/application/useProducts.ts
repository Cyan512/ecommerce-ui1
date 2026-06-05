import { useState, useEffect, useCallback } from 'react'
import { productService } from '../infrastructure/ProductService'
import type { Producto, ProductoRequest } from '../domain/models'
import type { ApiHttpError } from '@/core/domain/models/errors'

function getErrorMessage(e: unknown): string {
  const apiErr = e as ApiHttpError
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useProducts() {
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    productService.list()
      .then(data => { setProducts(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  return { products, loading, error, refetch }
}

export function useProductDetail(id: string) {
  const [product, setProduct] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    productService.getById(id)
      .then(data => { setProduct(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [id])

  return { product, loading, error }
}

export function useProductsByCategory(categoriaId: string) {
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    productService.listByCategory(categoriaId)
      .then(data => { setProducts(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [categoriaId])

  return { products, loading, error }
}

export function useAdminProducts() {
  const { products, loading, error, refetch } = useProducts()

  const create = async (data: ProductoRequest): Promise<Producto> => {
    const created = await productService.create(data)
    await refetch()
    return created
  }

  const update = async (id: string, data: ProductoRequest) => {
    await productService.update(id, data)
    await refetch()
  }

  const remove = async (id: string) => {
    await productService.delete(id)
    await refetch()
  }

  return { products, loading, error, create, update, remove }
}
