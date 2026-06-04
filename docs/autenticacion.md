# Autenticación — Ecommerce API

## Visión General

La API soporta **dos métodos de autenticación**:

1. **Login local** — email + password (registro en la propia app)
2. **Login con Google** — OAuth2 delegado

Ambos métodos devuelven un **JWT** que debe enviarse en cada request como `Bearer token`.

---

## Endpoints

### `POST /api/auth/register`

Registrar un usuario como `CLIENTE`.

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456",
  "nombre": "Juan Pérez"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `email` | string | ✅ (formato email válido) |
| `password` | string | ✅ (mínimo 6 caracteres) |
| `nombre` | string | ✅ |

**Respuesta — `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "tipo": "CLIENTE"
}
```

---

### `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Respuesta — `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "tipo": "CLIENTE"
}
```

**Errores:**
- `400` — validación fallida, credenciales inválidas, usuario deshabilitado
- `409` — email ya registrado

---

### `POST /api/auth/google`

Login con Google desde mobile o server-to-server.

**Query Params:**
```
POST /api/auth/google?email=user@gmail.com&nombre=User%20Name&google_id=123456789
```

**Respuesta — `200 OK`:** mismo formato que login.

---

### Login con Google vía Browser (SPA)

1. Frontend redirige a `GET /oauth2/authorization/google`
2. Google redirige a `http://localhost:8080/login/oauth2/code/google`
3. Backend procesa y redirige a `{FRONTEND_URL}/auth/callback?token=xxx`
4. Frontend extrae el token de la URL

---

## Roles y Rutas

El JWT incluye `tipo` que se mapea a los siguientes roles de Spring Security:

| tipo (JWT) | Rol Spring | Acceso |
|---|---|---|
| `CLIENTE` | `ROLE_CLIENT` | Carrito, pedidos, wishlist, direcciones, reseñas |
| `ADMINISTRADOR` | `ROLE_ADMIN` | `/api/admin/**` (CRUD productos, categorías, pedidos) |
| `VENDEDOR` | `ROLE_STAFF` | Pedidos asignados |

### Rutas públicas
- `GET /api/products`, `GET /api/products/{id}`
- `GET /api/categories`, `GET /api/categories/{id}`
- `GET /api/reviews/product/{productoId}`
- `GET /api/coupons/{codigo}`
- Swagger (`/swagger-ui.html`, `/api-docs/**`)

### Rutas protegidas (requieren JWT)
- `CLIENT` — `/api/cart/**`, `/api/orders/**`, `/api/wishlist/**`, `/api/direcciones/**`
- `ADMIN` — `/api/admin/**`

---

## Uso del JWT

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

---

## Configuración Google Cloud Console

**Redirect URI autorizada:**
```
http://localhost:8080/login/oauth2/code/google
```

**Variables de entorno obligatorias:**
```
OAUTH2_CLIENT_ID=xxxxx.apps.googleusercontent.com
OAUTH2_CLIENT_SECRET=GOCSPX-xxxxx
JWT_SECRET=base64-256bit-key
FRONTEND_URL=http://localhost:4200
```

**Variables de entorno opcionales:**
```
SERVER_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
JPA_DDL_AUTO=update
JPA_SHOW_SQL=true
JWT_EXPIRATION=86400000
SPRINGDOC_API_TITLE=Ecommerce API
SPRINGDOC_API_DESCRIPTION=API REST de e-commerce
SPRINGDOC_API_VERSION=0.0.1
```
