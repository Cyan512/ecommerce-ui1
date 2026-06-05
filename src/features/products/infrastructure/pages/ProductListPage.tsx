import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProducts, useProductsByCategory } from '../../application/useProducts'
import { useCategories } from '@/features/categories/application/useCategories'

export default function ProductListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { categories, loading: catLoading } = useCategories()
  const { products: allProducts, loading: prodLoading, error: prodError } = useProducts()
  const { products: filteredProducts, loading: filterLoading, error: filterError } = useProductsByCategory(selectedCategory ?? '')

  const loading = selectedCategory ? filterLoading : prodLoading
  const error = selectedCategory ? filterError : prodError
  const products = selectedCategory ? filteredProducts : allProducts

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Productos</h1>

      {catLoading ? (
        <p className="mb-4 text-sm text-muted-foreground">Cargando categorías...</p>
      ) : categories.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.nombre}
            </Button>
          ))}
        </div>
      ) : null}

      {loading && <p className="text-muted-foreground">Cargando productos...</p>}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifica que el backend esté corriendo en{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">localhost:8080</code>
          </p>
        </div>
      )}

      {!loading && !error && (
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
      )}
    </div>
  )
}
