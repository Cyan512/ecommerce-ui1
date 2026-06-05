import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminUsers } from '../../application/useAdminUsers'

export default function AdminUsersPage() {
  const { users, loading, error, create, block, unblock, remove } = useAdminUsers()
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<'CLIENTE' | 'VENDEDOR' | 'ADMINISTRADOR'>('CLIENTE')
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await create({ email, password, nombre, tipo })
      setEmail('')
      setPassword('')
      setNombre('')
      setTipo('CLIENTE')
      setShowForm(false)
    } catch {
      /* handled by hook */
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Cargando usuarios...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo usuario'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Crear usuario</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="u-email">Email</Label>
                <Input id="u-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="u-password">Contraseña</Label>
                <Input id="u-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="u-nombre">Nombre</Label>
                <Input id="u-nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="u-tipo">Tipo</Label>
                <select id="u-tipo" value={tipo} onChange={e => setTipo(e.target.value as 'CLIENTE' | 'VENDEDOR' | 'ADMINISTRADOR')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="CLIENTE">Cliente</option>
                  <option value="VENDEDOR">Vendedor</option>
                  <option value="ADMINISTRADOR">Admin</option>
                </select>
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear usuario'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Nombre</th>
                <th className="p-3 font-medium">Tipo</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {u.tipo}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-medium ${u.activo ? 'text-green-600' : 'text-destructive'}`}>
                      {u.activo ? 'Activo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      {u.activo ? (
                        <Button variant="outline" size="sm" onClick={() => block(u.id)}>Bloquear</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => unblock(u.id)}>Desbloquear</Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => remove(u.id)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
