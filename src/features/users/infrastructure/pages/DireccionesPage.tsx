import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDirecciones } from '../../application/useDirecciones'

export default function DireccionesPage() {
  const { direcciones, loading, error, create, remove } = useDirecciones()
  const [showForm, setShowForm] = useState(false)
  const [calle, setCalle] = useState('')
  const [colonia, setColonia] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [estado, setEstado] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [pais, setPais] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await create({ calle, colonia, ciudad, estado, codigoPostal, pais })
    setSaving(false)
    setShowForm(false)
    setCalle(''); setColonia(''); setCiudad(''); setEstado(''); setCodigoPostal(''); setPais('')
  }

  if (loading) return <p>Cargando direcciones...</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mis Direcciones</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nueva dirección'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Nueva dirección</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="calle">Calle</Label><Input id="calle" value={calle} onChange={e => setCalle(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="colonia">Colonia</Label><Input id="colonia" value={colonia} onChange={e => setColonia(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="ciudad">Ciudad</Label><Input id="ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="estado">Estado</Label><Input id="estado" value={estado} onChange={e => setEstado(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="codigoPostal">CP</Label><Input id="codigoPostal" value={codigoPostal} onChange={e => setCodigoPostal(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="pais">País</Label><Input id="pais" value={pais} onChange={e => setPais(e.target.value)} required /></div>
              <div className="sm:col-span-2"><Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {direcciones.length === 0 && <p className="text-muted-foreground">No tienes direcciones guardadas.</p>}
        {direcciones.map(dir => (
          <Card key={dir.id}>
            <CardContent className="flex items-start justify-between p-4">
              <div>
                <p>{dir.calle}, {dir.colonia}</p>
                <p className="text-sm text-muted-foreground">{dir.ciudad}, {dir.estado}, {dir.codigoPostal}</p>
                <p className="text-sm text-muted-foreground">{dir.pais}</p>
                {dir.principal && <span className="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Principal</span>}
              </div>
              <Button variant="destructive" size="sm" onClick={() => remove(dir.id)}>Eliminar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
