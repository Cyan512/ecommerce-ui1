import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminCategories } from '../../application/useCategories'

export default function AdminCategoryListPage() {
  const { categories, loading, remove } = useAdminCategories()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    setDeleting(id)
    await remove(id)
    setDeleting(null)
  }

  if (loading) return <p>Cargando...</p>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías</CardTitle>
        <Link to="/admin/categories/new">
          <Button>Nueva categoría</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium">Nombre</th>
              <th className="pb-2 font-medium">Descripción</th>
              <th className="pb-2 font-medium">Padre ID</th>
              <th className="pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="py-2">{cat.nombre}</td>
                <td className="py-2 text-muted-foreground">{cat.descripcion ?? '—'}</td>
                <td className="py-2 text-muted-foreground">{cat.padreId ?? '—'}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <Link to={`/admin/categories/${cat.id}/edit`}>
                      <Button variant="outline" size="sm">Editar</Button>
                    </Link>
                    <Button variant="destructive" size="sm" disabled={deleting === cat.id} onClick={() => handleDelete(cat.id)}>
                      {deleting === cat.id ? '...' : 'Eliminar'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
