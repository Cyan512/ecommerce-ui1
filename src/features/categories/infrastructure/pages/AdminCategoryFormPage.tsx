import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { categoryService } from '../CategoryService'
import { useAdminCategories } from '../../application/useCategories'

export default function AdminCategoryFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { create, update } = useAdminCategories()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [padreId, setPadreId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      categoryService.getById(id!).then(cat => {
        setNombre(cat.nombre)
        setDescripcion(cat.descripcion ?? '')
        setPadreId(cat.padreId ?? '')
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = { nombre, descripcion: descripcion || undefined, padreId: padreId || undefined }
    if (isEdit) {
      await update(id!, data)
    } else {
      await create(data)
    }
    setLoading(false)
    navigate('/admin/categories')
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="padreId">ID de categoría padre (opcional)</Label>
            <Input id="padreId" value={padreId} onChange={e => setPadreId(e.target.value)} placeholder="UUID" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
