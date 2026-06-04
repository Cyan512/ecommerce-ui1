# Categorías — Ecommerce API

## Visión General

Módulo de categorías con soporte para jerarquía padre-hijo. Las categorías se gestionan mediante endpoints públicos (consulta) y administrativos (CRUD completo).

---

## Modelo de Datos

### Tabla `categorias`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `nombre` | VARCHAR(100) | NOT NULL |
| `descripcion` | TEXT | — |
| `padre_id` | UUID | FK → categorias(id), nullable (para subcategorías) |

---

## Endpoints — Públicos

### `GET /api/categories`

Listar todas las categorías.

**Respuesta — `200 OK`:**
```json
[
  {
    "id": "47b6be29-b839-4abd-89a4-d146e30316d8",
    "nombre": "Electrónicos",
    "descripcion": "Productos electrónicos",
    "padreId": null
  }
]
```

---

### `GET /api/categories/{id}`

Obtener detalle de una categoría.

**Respuesta — `200 OK`:**
```json
{
  "id": "47b6be29-b839-4abd-89a4-d146e30316d8",
  "nombre": "Electrónicos",
  "descripcion": "Productos electrónicos",
  "padreId": null
}
```

**Errores:**
- `404` — categoría no encontrada

---

## Endpoints — Admin

Requieren rol `ADMINISTRADOR`. Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### `POST /api/admin/categories`

Crear una categoría.

**Body:**
```json
{
  "nombre": "Laptops",
  "descripcion": "Laptops y accesorios",
  "padreId": "47b6be29-b839-4abd-89a4-d146e30316d8"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `nombre` | string | ✅ |
| `descripcion` | string | — |
| `padreId` | UUID | — (null = categoría raíz) |

**Respuesta — `200 OK`:**
```json
{
  "id": "a1b2c3d4-...",
  "nombre": "Laptops",
  "descripcion": "Laptops y accesorios",
  "padreId": "47b6be29-b839-4abd-89a4-d146e30316d8"
}
```

---

### `PUT /api/admin/categories/{id}`

Actualizar una categoría existente.

**Body:** mismo formato que POST.

**Respuesta — `200 OK`:** categoría actualizada.

---

### `DELETE /api/admin/categories/{id}`

Eliminar una categoría.

**Respuesta — `204 No Content`**

**Errores:**
- `404` — categoría no encontrada

---

## DTOs

### CategoriaRequest
```json
{
  "nombre": "string (requerido)",
  "descripcion": "string",
  "padreId": "UUID (nullable)"
}
```

### CategoriaResponse
```json
{
  "id": "UUID",
  "nombre": "string",
  "descripcion": "string",
  "padreId": "UUID (nullable)"
}
```

---

## Ejemplo Completo

```bash
# Login como admin
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Crear categoría raíz
curl -X POST http://localhost:8080/api/admin/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Electrónicos","descripcion":"Productos electrónicos"}'

# Crear subcategoría
curl -X POST http://localhost:8080/api/admin/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptops","descripcion":"Laptops","padreId":"ID_DE_ELECTRONICOS"}'

# Listar (público)
curl http://localhost:8080/api/categories
```
