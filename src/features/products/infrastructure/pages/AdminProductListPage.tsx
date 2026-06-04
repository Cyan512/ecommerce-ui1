import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminProducts } from '../../application/useProducts'

export default function AdminProductListPage() {
  const { products, loading, remove } = useAdminProducts()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Desactivar este producto?')) return
    setDeleting(id)
    await remove(id)
    setDeleting(null)
  }

  if (loading) return <p>Cargando...</p>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Productos</CardTitle>
        <Link to="/admin/products/new">
          <Button>Nuevo producto</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium">Nombre</th>
              <th className="pb-2 font-medium">Precio</th>
              <th className="pb-2 font-medium">Stock</th>
              <th className="pb-2 font-medium">Activo</th>
              <th className="pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2">{p.nombre}</td>
                <td className="py-2">${p.precio.toFixed(2)}</td>
                <td className="py-2">{p.stock}</td>
                <td className="py-2">{p.activo ? 'Sí' : 'No'}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${p.id}/edit`}>
                      <Button variant="outline" size="sm">Editar</Button>
                    </Link>
                    <Button variant="destructive" size="sm" disabled={deleting === p.id} onClick={() => handleDelete(p.id)}>
                      {deleting === p.id ? '...' : 'Desactivar'}
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
