import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/core/infrastructure/auth/AuthProvider'
import AuthLayout from '@/layouts/AuthLayout'
import ClientLayout from '@/layouts/ClientLayout'
import AdminLayout from '@/layouts/AdminLayout'
import LoginPage from '@/features/auth/infrastructure/pages/LoginPage'
import RegisterPage from '@/features/auth/infrastructure/pages/RegisterPage'
import CallbackPage from '@/features/auth/infrastructure/pages/CallbackPage'
import ProductListPage from '@/features/products/infrastructure/pages/ProductListPage'
import ProductDetailPage from '@/features/products/infrastructure/pages/ProductDetailPage'
import CartPage from '@/features/cart/infrastructure/pages/CartPage'
import WishlistPage from '@/features/wishlist/infrastructure/pages/WishlistPage'
import MyOrdersPage from '@/features/orders/infrastructure/pages/MyOrdersPage'
import OrderDetailPage from '@/features/orders/infrastructure/pages/OrderDetailPage'
import DireccionesPage from '@/features/users/infrastructure/pages/DireccionesPage'
import AdminProductListPage from '@/features/products/infrastructure/pages/AdminProductListPage'
import AdminProductFormPage from '@/features/products/infrastructure/pages/AdminProductFormPage'
import AdminCategoryListPage from '@/features/categories/infrastructure/pages/AdminCategoryListPage'
import AdminCategoryFormPage from '@/features/categories/infrastructure/pages/AdminCategoryFormPage'
import AdminOrderListPage from '@/features/orders/infrastructure/pages/AdminOrderListPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<CallbackPage />} />
          </Route>

          <Route element={<ClientLayout />}>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/direcciones" element={<DireccionesPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/:id/edit" element={<AdminProductFormPage />} />
            <Route path="categories" element={<AdminCategoryListPage />} />
            <Route path="categories/new" element={<AdminCategoryFormPage />} />
            <Route path="categories/:id/edit" element={<AdminCategoryFormPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
