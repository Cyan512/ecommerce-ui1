import { useState, useEffect, useCallback } from 'react'
import { orderService } from '../infrastructure/OrderService'
import type { Pedido, CreatePedidoRequest } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useMyOrders() {
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    orderService.listMyOrders()
      .then(data => { setOrders(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  return { orders, loading, error, refetch }
}

export function useOrderDetail(id: string) {
  const [order, setOrder] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    orderService.getById(id)
      .then(data => { setOrder(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [id])

  return { order, loading, error }
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: CreatePedidoRequest): Promise<Pedido | null> => {
    setLoading(true)
    setError(null)
    try {
      const pedido = await orderService.create(data)
      return pedido
    } catch (e: unknown) {
      setError(getErrorMessage(e))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    orderService.listAll()
      .then(data => { setOrders(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  const updateStatus = async (id: string, estado: string) => {
    await orderService.updateStatus(id, { estado })
    await refetch()
  }

  return { orders, loading, error, updateStatus }
}
