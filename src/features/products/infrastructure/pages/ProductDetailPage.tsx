import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductDetail } from '../../application/useProducts'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProductDetail(id!)

  if (loading) return <p>Cargando...</p>
  if (error || !product) return <p className="text-destructive">{error ?? 'Producto no encontrado'}</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/products" className="mb-4 block text-sm text-muted-foreground hover:underline">
        ← Volver a productos
      </Link>
      <Card className="overflow-hidden">
        {product.imagenUrl && (
          <img src={product.imagenUrl} alt={product.nombre} className="h-64 w-full object-cover" />
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{product.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{product.descripcion}</p>
          <p className="text-3xl font-bold">${product.precio.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Stock disponible: {product.stock}</p>
          <Button>Agregar al carrito</Button>
        </CardContent>
      </Card>
    </div>
  )
}
