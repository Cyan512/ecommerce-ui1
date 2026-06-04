import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { productService } from '../ProductService'
import { useAdminProducts } from '../../application/useProducts'

export default function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { create, update } = useAdminProducts()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      productService.getById(id!).then(p => {
        setNombre(p.nombre)
        setDescripcion(p.descripcion ?? '')
        setPrecio(String(p.precio))
        setStock(String(p.stock))
        setCategoriaId(p.categoriaId ?? '')
        setImagenUrl(p.imagenUrl ?? '')
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      nombre,
      descripcion: descripcion || undefined,
      precio: Number(precio),
      stock: Number(stock),
      categoriaId: categoriaId || undefined,
      imagenUrl: imagenUrl || undefined,
    }
    if (isEdit) {
      await update(id!, data)
    } else {
      await create(data)
    }
    setLoading(false)
    navigate('/admin/products')
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
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
            <Label htmlFor="precio">Precio</Label>
            <Input id="precio" type="number" step="0.01" min="0" value={precio} onChange={e => setPrecio(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoriaId">ID de Categoría</Label>
            <Input id="categoriaId" value={categoriaId} onChange={e => setCategoriaId(e.target.value)} placeholder="UUID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagenUrl">URL de imagen</Label>
            <Input id="imagenUrl" type="url" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
