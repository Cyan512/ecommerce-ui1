# Carrito y Wishlist — Ecommerce API

## Visión General

Módulo de carrito de compras y lista de deseos. Ambos se crean automáticamente (lazy creation) la primera vez que el usuario los consulta. Los items del carrito incluyen precio unitario y subtotal calculados en backend.

---

## Modelo de Datos

### Tabla `carritos`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `usuario_id` | UUID | FK → users(id), UNIQUE |

### Tabla `carrito_items`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `carrito_id` | UUID | FK → carritos(id) |
| `producto_id` | UUID | FK → productos(id) |
| `cantidad` | INTEGER | NOT NULL |

### Tabla `wishlists`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `usuario_id` | UUID | FK → users(id), UNIQUE |

### Tabla `wishlist_items`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `wishlist_id` | UUID | FK → wishlists(id) |
| `producto_id` | UUID | FK → productos(id) |

---

## Endpoints — Carrito

Todos requieren rol `CLIENT`. Headers:
```
Authorization: Bearer <token>
```

### `GET /api/cart`

Obtener el carrito del usuario. Si no existe, se crea automáticamente.

**Respuesta — `200 OK`:**
```json
{
  "id": "ef952b08-...",
  "items": [
    {
      "id": "f0f3c2fd-...",
      "productoId": "f584f911-...",
      "productoNombre": "Laptop Gamer",
      "cantidad": 2,
      "precioUnitario": 25000.00,
      "subtotal": 50000.00
    }
  ],
  "total": 50000.00
}
```

---

### `POST /api/cart/items`

Agregar un producto al carrito. Si ya existe, incrementa la cantidad.

**Body:**
```json
{
  "productoId": "f584f911-...",
  "cantidad": 2
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `productoId` | UUID | ✅ |
| `cantidad` | integer | ✅ (positivo) |

**Respuesta — `200 OK`:** carrito actualizado (mismo formato que GET).

---

### `DELETE /api/cart/items/{itemId}`

Eliminar un item del carrito.

**Respuesta — `204 No Content`**

---

### `DELETE /api/cart`

Vaciar el carrito (elimina todos los items).

**Respuesta — `204 No Content`**

---

## Endpoints — Wishlist

Todos requieren rol `CLIENT`.

### `GET /api/wishlist`

Obtener la wishlist del usuario. Si no existe, se crea automáticamente.

**Respuesta — `200 OK`:**
```json
{
  "id": "a70f5459-...",
  "items": [
    {
      "id": "c4c61cbb-...",
      "productoId": "f584f911-...",
      "productoNombre": "Laptop Gamer"
    }
  ]
}
```

---

### `POST /api/wishlist/items`

Agregar un producto a la wishlist.

**Body:**
```json
{
  "productoId": "f584f911-..."
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `productoId` | UUID | ✅ |

**Respuesta — `200 OK`:** wishlist actualizada.

---

### `DELETE /api/wishlist/items/{itemId}`

Eliminar un item de la wishlist.

**Respuesta — `204 No Content`**

---

## DTOs

### CarritoItemRequest
```json
{
  "productoId": "UUID (requerido)",
  "cantidad": "int > 0 (requerido)"
}
```

### CarritoResponse
```json
{
  "id": "UUID",
  "items": [
    {
      "id": "UUID",
      "productoId": "UUID",
      "productoNombre": "string",
      "cantidad": "int",
      "precioUnitario": "number",
      "subtotal": "number"
    }
  ],
  "total": "number"
}
```

### WishlistResponse
```json
{
  "id": "UUID",
  "items": [
    {
      "id": "UUID",
      "productoId": "UUID",
      "productoNombre": "string"
    }
  ]
}
```

---

## Ejemplo Completo

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Agregar al carrito
curl -X POST http://localhost:8080/api/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productoId":"PROD_ID","cantidad":2}'

# Ver carrito
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/cart

# Agregar a wishlist
curl -X POST http://localhost:8080/api/wishlist/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productoId":"PROD_ID"}'

# Ver wishlist
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/wishlist
```
