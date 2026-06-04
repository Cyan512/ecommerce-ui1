# Productos y Reseñas — Ecommerce API

## Visión General

Módulo de productos con catálogo público y reseñas de usuarios. Los productos tienen un borrado lógico (`activo = false`) y soportan filtrado por categoría. Las reseñas permiten calificación (1-5) y comentario.

---

## Modelo de Datos

### Tabla `productos`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `nombre` | VARCHAR(255) | NOT NULL |
| `descripcion` | TEXT | — |
| `precio` | DECIMAL(10,2) | NOT NULL |
| `stock` | INTEGER | NOT NULL, >= 0 |
| `categoria_id` | UUID | FK → categorias(id) |
| `imagen_url` | VARCHAR(500) | — |
| `activo` | BOOLEAN | NOT NULL, default true |

### Tabla `resenias`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `usuario_id` | UUID | FK → users(id) |
| `producto_id` | UUID | FK → productos(id) |
| `calificacion` | INTEGER | NOT NULL, 1-5 |
| `comentario` | TEXT | — |
| `fecha` | TIMESTAMP | NOT NULL |

---

## Endpoints — Productos (Públicos)

### `GET /api/products`

Listar productos activos.

**Respuesta — `200 OK`:**
```json
[
  {
    "id": "f584f911-...",
    "nombre": "Laptop Gamer",
    "descripcion": "Laptop gamer de alta gama",
    "precio": 28000.00,
    "stock": 9,
    "categoriaId": "47b6be29-...",
    "imagenUrl": "https://example.com/laptop.jpg",
    "activo": true
  }
]
```

---

### `GET /api/products/{id}`

Obtener detalle de un producto.

**Respuesta — `200 OK`:**
```json
{
  "id": "f584f911-...",
  "nombre": "Laptop Gamer",
  "descripcion": "Laptop gamer de alta gama",
  "precio": 28000.00,
  "stock": 9,
  "categoriaId": "47b6be29-...",
  "imagenUrl": "https://example.com/laptop.jpg",
  "activo": true
}
```

**Errores:**
- `404` — producto no encontrado

---

### `GET /api/products/by-category/{categoriaId}`

Filtrar productos por categoría.

**Respuesta — `200 OK`:** array de productos (mismo formato).

---

## Endpoints — Productos (Admin)

Requieren rol `ADMINISTRADOR`.

### `POST /api/admin/products`

Crear un producto.

**Body:**
```json
{
  "nombre": "Laptop Gamer",
  "descripcion": "Laptop gamer de alta gama",
  "precio": 28000.00,
  "stock": 10,
  "categoriaId": "47b6be29-...",
  "imagenUrl": "https://example.com/laptop.jpg"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `nombre` | string | ✅ |
| `descripcion` | string | — |
| `precio` | number | ✅ (positivo) |
| `stock` | integer | ✅ (>= 0) |
| `categoriaId` | UUID | — |
| `imagenUrl` | string | — |

**Respuesta — `200 OK`:** producto creado (mismo formato).

---

### `PUT /api/admin/products/{id}`

Actualizar un producto existente.

**Body:** mismo formato que POST.

**Respuesta — `200 OK`:** producto actualizado.

---

### `DELETE /api/admin/products/{id}`

Desactivar un producto (borrado lógico: `activo = false`).

**Respuesta — `200 OK`**

---

## Endpoints — Reseñas

### `GET /api/reviews/product/{productoId}`

Obtener reseñas de un producto.

**Respuesta — `200 OK`:**
```json
[
  {
    "id": "UUID",
    "usuarioId": "UUID",
    "usuarioNombre": "Juan Pérez",
    "productoId": "UUID",
    "calificacion": 5,
    "comentario": "Excelente producto",
    "fecha": "2026-06-04T12:00:00"
  }
]
```

---

### `POST /api/reviews`

Crear una reseña (requiere `CLIENT`).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "productoId": "f584f911-...",
  "calificacion": 5,
  "comentario": "Excelente producto"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `productoId` | UUID | ✅ |
| `calificacion` | integer | ✅ (1-5) |
| `comentario` | string | — |

**Respuesta — `200 OK`:** reseña creada.

**Errores:**
- `409` — ya existe una reseña del mismo usuario para ese producto

---

### `DELETE /api/reviews/{id}`

Eliminar una reseña propia (requiere `CLIENT`).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta — `204 No Content`**

**Errores:**
- `400` — la reseña pertenece a otro usuario
- `404` — reseña no encontrada

---

## DTOs

### ProductoRequest
```json
{
  "nombre": "string (requerido)",
  "descripcion": "string",
  "precio": "number > 0 (requerido)",
  "stock": "int >= 0 (requerido)",
  "categoriaId": "UUID",
  "imagenUrl": "string"
}
```

### ProductoResponse
```json
{
  "id": "UUID",
  "nombre": "string",
  "descripcion": "string",
  "precio": "number",
  "stock": "int",
  "categoriaId": "UUID",
  "imagenUrl": "string",
  "activo": "boolean"
}
```

### ReseniaRequest
```json
{
  "productoId": "UUID (requerido)",
  "calificacion": "int (1-5, requerido)",
  "comentario": "string"
}
```

### ReseniaResponse
```json
{
  "id": "UUID",
  "usuarioId": "UUID",
  "usuarioNombre": "string",
  "productoId": "UUID",
  "calificacion": "int",
  "comentario": "string",
  "fecha": "datetime"
}
```

---

## Ejemplo Completo

```bash
# Login admin
ADM_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Crear producto
curl -X POST http://localhost:8080/api/admin/products \
  -H "Authorization: Bearer $ADM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptop","descripcion":"Laptop gamer","precio":25000,"stock":10,"categoriaId":"CAT_ID"}'

# Login cliente
CLI_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@test.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Crear reseña
curl -X POST http://localhost:8080/api/reviews \
  -H "Authorization: Bearer $CLI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productoId":"PROD_ID","calificacion":5,"comentario":"Excelente"}'

# Listar reseñas (público)
curl http://localhost:8080/api/reviews/product/PROD_ID
```
