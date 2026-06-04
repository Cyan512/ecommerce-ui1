import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProducts } from '../../application/useProducts'

export default function ProductListPage() {
  const { products, loading, error } = useProducts()

  if (loading) return <p className="text-muted-foreground">Cargando productos...</p>
  if (error) return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
      <p className="text-destructive font-medium">{error}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Verifica que el backend esté corriendo en{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">localhost:8080</code>
      </p>
    </div>
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Productos</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            {product.imagenUrl && (
              <img src={product.imagenUrl} alt={product.nombre} className="h-48 w-full object-cover" />
            )}
            <CardHeader>
              <CardTitle className="text-base">{product.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>
              <p className="mb-2 text-lg font-bold">${product.precio.toFixed(2)}</p>
              <p className="mb-3 text-xs text-muted-foreground">Stock: {product.stock}</p>
              <Link to={`/products/${product.id}`}>
                <Button className="w-full" variant="outline">Ver detalle</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
