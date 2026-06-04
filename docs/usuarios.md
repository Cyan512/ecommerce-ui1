# Usuarios y Direcciones — Ecommerce API

## Visión General

Módulo de gestión de usuarios y direcciones. Implementa herencia de tipo `SINGLE_TABLE` con discriminador `tipo` para los roles `CLIENTE`, `ADMINISTRADOR` y `VENDEDOR`.

---

## Modelo de Datos

### Tabla `users`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `nombre` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE |
| `password` | VARCHAR(255) | — (nullable para OAuth) |
| `telefono` | VARCHAR(20) | — |
| `oauth_provider` | VARCHAR(50) | — |
| `oauth_id` | VARCHAR(255) | — |
| `tipo` | VARCHAR(31) | Discriminador: CLIENTE, ADMINISTRADOR, VENDEDOR |
| `fecha_registro` | TIMESTAMP | NOT NULL |
| `activo` | BOOLEAN | NOT NULL, default true |

### Tabla `direcciones`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `usuario_id` | UUID | FK → users(id) |
| `calle` | VARCHAR(255) | NOT NULL |
| `colonia` | VARCHAR(255) | NOT NULL |
| `ciudad` | VARCHAR(255) | NOT NULL |
| `estado` | VARCHAR(255) | NOT NULL |
| `codigo_postal` | VARCHAR(20) | NOT NULL |
| `pais` | VARCHAR(100) | NOT NULL |
| `principal` | BOOLEAN | default false |

---

## Roles de Usuario

| tipo (BD/JWT) | Rol Spring | Acceso |
|---|---|---|
| `CLIENTE` | `ROLE_CLIENT` | Carrito, pedidos, wishlist, direcciones, reseñas |
| `ADMINISTRADOR` | `ROLE_ADMIN` | `/api/admin/**` (CRUD productos, categorías, pedidos) |
| `VENDEDOR` | `ROLE_STAFF` | Pedidos asignados |

---

## Endpoints — Direcciones

### `GET /api/direcciones`

Obtener las direcciones del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta — `200 OK`:**
```json
[
  {
    "id": "d91eb4d8-b5ed-409f-b955-b365b5cce361",
    "calle": "Av Principal 123",
    "colonia": "Centro",
    "ciudad": "CDMX",
    "estado": "CDMX",
    "codigoPostal": "06600",
    "pais": "Mexico",
    "principal": true
  }
]
```

---

### `POST /api/direcciones`

Crear una nueva dirección.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "calle": "Av Principal 123",
  "colonia": "Centro",
  "ciudad": "CDMX",
  "estado": "CDMX",
  "codigoPostal": "06600",
  "pais": "Mexico",
  "principal": true
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `calle` | string | ✅ |
| `colonia` | string | ✅ |
| `ciudad` | string | ✅ |
| `estado` | string | ✅ |
| `codigoPostal` | string | ✅ |
| `pais` | string | ✅ |
| `principal` | boolean | — |

**Respuesta — `201 Created`:**
```json
{
  "id": "d91eb4d8-b5ed-409f-b955-b365b5cce361",
  "calle": "Av Principal 123",
  "colonia": "Centro",
  "ciudad": "CDMX",
  "estado": "CDMX",
  "codigoPostal": "06600",
  "pais": "Mexico",
  "principal": true
}
```

---

### `DELETE /api/direcciones/{id}`

Eliminar una dirección propia.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta — `204 No Content`**

**Errores:**
- `404` — la dirección no existe
- `400` — la dirección pertenece a otro usuario

---

## DTOs

### DireccionRequest
```json
{
  "calle": "string (requerido)",
  "colonia": "string (requerido)",
  "ciudad": "string (requerido)",
  "estado": "string (requerido)",
  "codigoPostal": "string (requerido)",
  "pais": "string (requerido)",
  "principal": "boolean"
}
```

### DireccionResponse
```json
{
  "id": "UUID",
  "calle": "string",
  "colonia": "string",
  "ciudad": "string",
  "estado": "string",
  "codigoPostal": "string",
  "pais": "string",
  "principal": "boolean"
}
```

---

## Ejemplo Completo

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Crear dirección
curl -X POST http://localhost:8080/api/direcciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"calle":"Av Principal 123","colonia":"Centro","ciudad":"CDMX","estado":"CDMX","codigoPostal":"06600","pais":"Mexico","principal":true}'

# Listar direcciones
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/direcciones

# Eliminar dirección
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/direcciones/{id}
```
