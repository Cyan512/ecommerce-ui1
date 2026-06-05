import { useState, useEffect, useCallback } from 'react'
import { adminUserService } from '../infrastructure/AdminUserService'
import type { AdminUserRequest, AdminUserResponse } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    adminUserService.list()
      .then(data => { setUsers(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  const create = async (data: AdminUserRequest) => {
    await adminUserService.create(data)
    await refetch()
  }

  const block = async (id: string) => {
    await adminUserService.block(id)
    await refetch()
  }

  const unblock = async (id: string) => {
    await adminUserService.unblock(id)
    await refetch()
  }

  const remove = async (id: string) => {
    await adminUserService.remove(id)
    await refetch()
  }

  return { users, loading, error, create, block, unblock, remove }
}
