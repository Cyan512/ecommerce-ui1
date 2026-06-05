import { useState, useEffect, useCallback } from 'react'
import { profileService } from '../infrastructure/ProfileService'
import type { ProfileResponse, ChangePasswordRequest, ChangeNombreRequest } from '../infrastructure/ProfileService'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    profileService.get()
      .then(data => { setProfile(data); setLoading(false) })
      .catch((e: unknown) => { setError(getErrorMessage(e)); setLoading(false) })
  }, [key])

  const refetch = useCallback(() => setKey(k => k + 1), [])

  const changePassword = async (data: ChangePasswordRequest) => {
    await profileService.changePassword(data)
  }

  const changeNombre = async (data: ChangeNombreRequest) => {
    const updated = await profileService.changeNombre(data)
    setProfile(updated)
  }

  return { profile, loading, error, refetch, changePassword, changeNombre }
}
