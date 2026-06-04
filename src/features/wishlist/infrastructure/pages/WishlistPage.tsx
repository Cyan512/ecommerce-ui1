import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWishlist } from '../../application/useWishlist'

export default function WishlistPage() {
  const { wishlist, loading, error, removeItem } = useWishlist()

  if (loading) return <p>Cargando wishlist...</p>
  if (error) return <p className="text-destructive">{error}</p>
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="mb-4 text-2xl font-bold">Tu wishlist está vacía</h1>
        <Link to="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Wishlist</h1>
      <div className="space-y-3">
        {wishlist.items.map(item => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <Link to={`/products/${item.productoId}`} className="font-medium hover:underline">
                {item.productoNombre}
              </Link>
              <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>Eliminar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
