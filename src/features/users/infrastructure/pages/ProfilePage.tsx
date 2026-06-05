import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/core/infrastructure/auth/useAuth'
import { useProfile } from '../../application/useProfile'

export default function ProfilePage() {
  const { profile, loading, error, changePassword, changeNombre } = useProfile()
  const { updateUser } = useAuth()

  const [nombre, setNombre] = useState('')
  const [nombreMsg, setNombreMsg] = useState<string | null>(null)
  const [nombreErr, setNombreErr] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passMsg, setPassMsg] = useState<string | null>(null)
  const [passErr, setPassErr] = useState<string | null>(null)
  const [passSubmitting, setPassSubmitting] = useState(false)

  if (loading) return <p>Cargando perfil...</p>
  if (error) return <p className="text-destructive">{error}</p>
  if (!profile) return <p className="text-destructive">No se pudo cargar el perfil</p>

  const handleNombreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNombreErr(null)
    setNombreMsg(null)
    try {
      await changeNombre({ nombre })
      updateUser({ email: profile.email, nombre, tipo: profile.tipo })
      setNombre('')
      setNombreMsg('Nombre actualizado correctamente')
    } catch {
      setNombreErr('Error al actualizar el nombre')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassErr(null)
    setPassMsg(null)
    setPassSubmitting(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setPassMsg('Contraseña actualizada correctamente')
    } catch {
      setPassErr('Error al actualizar la contraseña')
    } finally {
      setPassSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>

      <Card>
        <CardHeader><CardTitle className="text-lg">Información</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Email:</span> {profile.email}</p>
          <p><span className="font-medium">Nombre:</span> {profile.nombre}</p>
          <p>
            <span className="font-medium">Tipo:</span>{' '}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {profile.tipo === 'ADMINISTRADOR' ? 'Admin' : profile.tipo === 'VENDEDOR' ? 'Vendedor' : 'Cliente'}
            </span>
          </p>
          <p>
            <span className="font-medium">Estado:</span>{' '}
            <span className={profile.activo ? 'text-green-600' : 'text-destructive'}>
              {profile.activo ? 'Activo' : 'Inactivo'}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Cambiar nombre</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleNombreSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="nombre">Nuevo nombre</Label>
              <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            {nombreMsg && <p className="text-sm text-green-600">{nombreMsg}</p>}
            {nombreErr && <p className="text-sm text-destructive">{nombreErr}</p>}
            <Button type="submit">Guardar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Cambiar contraseña</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="current-password">Contraseña actual</Label>
              <Input id="current-password" type="password" value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input id="new-password" type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} required />
            </div>
            {passMsg && <p className="text-sm text-green-600">{passMsg}</p>}
            {passErr && <p className="text-sm text-destructive">{passErr}</p>}
            <Button type="submit" disabled={passSubmitting}>
              {passSubmitting ? 'Actualizando...' : 'Cambiar contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
