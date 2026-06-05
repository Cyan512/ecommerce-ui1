# Pedidos, Pagos, Envíos y Cupones — Ecommerce API

## Visión General

Módulo de pedidos con gestión de estados, cálculo automático de subtotal/descuento/total, soporte para cupones de descuento (porcentaje o monto fijo), y tablas de pago y envío para integración futura.

---

## Modelo de Datos

### Tabla `pedidos`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `usuario_id` | UUID | FK → users(id) |
| `direccion_id` | UUID | FK → direcciones(id) |
| `staff_id` | UUID | FK → users(id), nullable |
| `cupon_id` | UUID | FK → cupones(id), nullable |
| `subtotal` | DECIMAL(10,2) | NOT NULL |
| `descuento` | DECIMAL(10,2) | NOT NULL |
| `total` | DECIMAL(10,2) | NOT NULL |
| `estado` | VARCHAR(20) | NOT NULL |
| `fecha_creacion` | TIMESTAMP | NOT NULL |
| `fecha_actualizacion` | TIMESTAMP | — |

### Tabla `pedido_items`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `pedido_id` | UUID | FK → pedidos(id) |
| `producto_id` | UUID | FK → productos(id) |
| `cantidad` | INTEGER | NOT NULL |
| `precio_unitario` | DECIMAL(10,2) | NOT NULL |
| `subtotal` | DECIMAL(10,2) | NOT NULL |

### Tabla `pagos`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `pedido_id` | UUID | FK → pedidos(id) |
| `monto` | DECIMAL(10,2) | NOT NULL |
| `metodo` | VARCHAR(50) | — |
| `estado` | VARCHAR(20) | NOT NULL |
| `fecha_pago` | TIMESTAMP | — |

### Tabla `envios`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `pedido_id` | UUID | FK → pedidos(id) |
| `direccion` | TEXT | NOT NULL |
| `estado` | VARCHAR(20) | NOT NULL |
| `fecha_envio` | TIMESTAMP | — |
| `fecha_entrega` | TIMESTAMP | — |

### Tabla `cupones`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | UUID | PK, generado automáticamente |
| `codigo` | VARCHAR(50) | NOT NULL, UNIQUE |
| `tipo_descuento` | VARCHAR(20) | NOT NULL (PORCENTAJE / MONTO_FIJO) |
| `valor_descuento` | DECIMAL(10,2) | NOT NULL |
| `monto_minimo` | DECIMAL(10,2) | NOT NULL |
| `usos_actuales` | INTEGER | NOT NULL, default 0 |
| `usos_maximos` | INTEGER | NOT NULL |
| `activo` | BOOLEAN | NOT NULL, default true |

---

## Estados de Pedido

| Estado | Descripción |
|---|---|
| `PENDIENTE` | Pedido creado, pendiente de confirmación |
| `CONFIRMADO` | Pedido confirmado por el admin |
| `ENVIADO` | Pedido enviado |
| `ENTREGADO` | Pedido entregado |
| `CANCELADO` | Pedido cancelado |

---

## Endpoints — Pedidos (Cliente)

Todos requieren rol `CLIENT`. Headers:
```
Authorization: Bearer <token>
```

### `POST /api/orders`

Crear un pedido. Reduce el stock de los productos automáticamente.

**Body:**
```json
{
  "direccionId": "d91eb4d8-...",
  "cuponCodigo": "BIENVENIDO10",
  "items": [
    {
      "productoId": "f584f911-...",
      "cantidad": 1
    }
  ]
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `direccionId` | UUID | — |
| `cuponCodigo` | string | — |
| `items` | array | ✅ (mínimo 1) |
| `items[].productoId` | UUID | ✅ |
| `items[].cantidad` | int | ✅ |

**Respuesta — `201 Created`:**
```json
{
  "id": "b2f09df0-...",
  "usuarioEmail": "comprador@test.com",
  "estado": "PENDIENTE",
  "total": 22500.00,
  "fechaCreacion": "2026-06-04T17:22:11",
  "items": [
    {
      "productoId": "f584f911-...",
      "productoNombre": "Laptop Gamer",
      "cantidad": 1,
      "precioUnitario": 25000.00,
      "subtotal": 25000.00
    }
  ]
}
```

**Errores:**
- `404` — producto, dirección o cupón no encontrado
- `400` — stock insuficiente, cupón agotado, monto mínimo no alcanzado

---

### `GET /api/orders`

Obtener los pedidos del usuario autenticado.

**Respuesta — `200 OK`:**
```json
[
  {
    "id": "b2f09df0-...",
    "usuarioEmail": "comprador@test.com",
    "estado": "PENDIENTE",
    "total": 22500.00,
    "fechaCreacion": "2026-06-04T17:22:11",
    "items": [...]
  }
]
```

---

### `GET /api/orders/{id}`

Obtener detalle de un pedido.

**Respuesta — `200 OK`:** mismo formato.

**Errores:**
- `404` — pedido no encontrado

---

## Endpoints — Pedidos (Admin)

Requieren rol `ADMINISTRADOR`.

### `GET /api/admin/orders`

Listar todos los pedidos del sistema, incluyendo el email del cliente.

**Respuesta — `200 OK`:**
```json
[
  {
    "id": "b2f09df0-...",
    "usuarioEmail": "cliente@example.com",
    "estado": "PENDIENTE",
    "total": 22500.00,
    "fechaCreacion": "2026-06-04T17:22:11",
    "items": [
      {
        "productoId": "f584f911-...",
        "productoNombre": "Laptop Gamer",
        "cantidad": 1,
        "precioUnitario": 25000.00,
        "subtotal": 25000.00
      }
    ]
  }
]
```

> `usuarioEmail` será `null` si el usuario fue eliminado.

---

### `PUT /api/admin/orders/{id}/status`

Cambiar el estado de un pedido.

**Body:**
```json
{
  "estado": "CONFIRMADO"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `estado` | string | ✅ (PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO) |

**Respuesta — `200 OK`:** pedido actualizado.

---

## Endpoints — Cupones

### `GET /api/coupons/{codigo}`

Consultar un cupón por código.

**Respuesta — `200 OK`:**
```json
{
  "codigo": "BIENVENIDO10",
  "tipoDescuento": "PORCENTAJE",
  "valorDescuento": 10,
  "montoMinimo": 100.00,
  "activo": true
}
```

**Respuesta — `404`:** cupón no encontrado.

---

## DTOs

### PedidoRequest
```json
{
  "direccionId": "UUID",
  "cuponCodigo": "string",
  "items": [
    {
      "productoId": "UUID (requerido)",
      "cantidad": "int (requerido)"
    }
  ]
}
```

### PedidoResponse
```json
{
  "id": "UUID",
  "usuarioEmail": "string | null",
  "estado": "string",
  "total": "number",
  "fechaCreacion": "datetime",
  "items": [
    {
      "productoId": "UUID",
      "productoNombre": "string",
      "cantidad": "int",
      "precioUnitario": "number",
      "subtotal": "number"
    }
  ]
}
```

---

## Ejemplo Completo

```bash
# Login cliente
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"comprador@test.com","password":"123456","nombre":"Comprador"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Crear dirección
curl -X POST http://localhost:8080/api/direcciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"calle":"Av Principal","colonia":"Centro","ciudad":"CDMX","estado":"CDMX","codigoPostal":"06600","pais":"Mexico"}'

# Crear pedido
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"direccionId":"DIR_ID","items":[{"productoId":"PROD_ID","cantidad":1}]}'

# Admin cambia estado
ADM_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -d '{"email":"admin@test.com","password":"123456"}' \
  -H "Content-Type: application/json" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -X PUT http://localhost:8080/api/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer $ADM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"CONFIRMADO"}'
```
