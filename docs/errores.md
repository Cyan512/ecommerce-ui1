# Manejo de Errores — Ecommerce API

## Formato de Respuesta

Todos los errores siguen el formato JSON:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

Para errores de validación, se incluye el campo específico:

```json
{
  "email": "must be a well-formed email address",
  "password": "size must be between 6 and 2147483647"
}
```

---

## Códigos HTTP

| Código | Significado | Causas comunes |
|---|---|---|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado (register, crear dirección, pedido) |
| `204` | No Content | Recurso eliminado (delete) |
| `400` | Bad Request | Validación fallida, credenciales inválidas, error de negocio |
| `302` | Redirect | Falta autenticación (redirecciona a OAuth2 Google) |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Email duplicado, reseña duplicada, cupón agotado |
| `500` | Internal Server Error | Error inesperado |

---

## Excepciones y su HTTP Status

| Excepción | HTTP | Uso |
|---|---|---|
| `ResourceNotFoundException` | `404` | Producto, categoría, pedido, dirección, cupón no encontrado |
| `BusinessException` | `409` | Email duplicado, reseña duplicada, stock insuficiente, cupón agotado |
| `MethodArgumentNotValidException` | `400` | Validación de DTOs fallida (@NotBlank, @Email, @Positive, etc.) |
| `IllegalArgumentException` | `400` | Parámetros inválidos |
| `RuntimeException` | `400` | Errores de aplicación controlados |
| `Exception` (catch-all) | `500` | Error interno del servidor |

---

## Ejemplos de Errores

### Validación de campos
```json
// POST /api/auth/register — email inválido
{
  "password": "size must be between 6 and 2147483647",
  "email": "must be a well-formed email address",
  "nombre": "must not be blank"
}
```

### Recurso no encontrado
```json
// GET /api/products/00000000-0000-0000-0000-000000000000
{
  "error": "Producto no encontrado: 00000000-0000-0000-0000-000000000000"
}
```

### Conflicto de negocio
```json
// POST /api/auth/register — email ya existe
{
  "error": "El email ya está registrado"
}
```

```json
// POST /api/reviews — ya reseñaste ese producto
{
  "error": "Ya has reseñado este producto"
}
```

```json
// DELETE /api/admin/users/{id} — admin por defecto
{
  "error": "No se puede eliminar la cuenta administradora por defecto"
}
```

### Error de autenticación/autorización
```json
// POST /api/auth/login — credenciales incorrectas
{
  "error": "Credenciales inválidas"
}
```

### Stock insuficiente
```json
// POST /api/orders — sin stock
{
  "error": "Stock insuficiente para: Laptop Gamer"
}
```

### Cupón no válido
```json
// POST /api/orders — cupón inválido
{
  "error": "Cupón no válido o agotado"
}
```

---

## Stack Traces

Los errores `500` registran el stack trace completo en `/tmp/app.log` con nivel `ERROR`.  
Los errores controlados (`400`, `404`, `409`) se registran con nivel `WARN`.
