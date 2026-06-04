# Arquitectura del Proyecto — Ecommerce API

## Visión General

API RESTful para e-commerce construida con **Spring Boot 4.0.6** y **Java 21**.
Arquitectura **Hexagonal (Ports & Adapters)** combinada con **Vertical Slicing** — cada funcionalidad de negocio es un slice independiente con sus propias capas de dominio, aplicación e infraestructura.

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Java | 21 | Lenguaje |
| Spring Boot | 4.0.6 | Framework principal |
| Spring MVC | — | API REST |
| Spring Data JPA + Hibernate | — | ORM |
| PostgreSQL | — | Base de datos |
| Spring Security OAuth2 Client | — | Autenticación Google |
| Springdoc OpenAPI | 3.0.2 | Swagger UI |
| JJWT | 0.12.6 | Generación/validación de JWT |
| BCrypt | — | Encriptación de contraseñas |
| H2 | — | Base de datos para tests |
| Maven | 3.9.16 | Build |

---

## Arquitectura

**Hexagonal (Ports & Adapters)** + **Vertical Slicing**.

```
com.ecommerce
├── EcommerceApiApplication.java          ← Punto de entrada
│
├── config/                               ← Config (OpenAPI, etc.)
├── exception/                            ← Manejadores globales de errores
│
├── auth/       ← Autenticación (JWT, OAuth2, SecurityConfig)
├── user/       ← Usuarios + Direcciones
├── category/   ← Categorías
├── product/    ← Productos + Reseñas
├── cart/       ← Carritos + Wishlists
└── order/      ← Pedidos + Pagos + Envíos + Cupones
```

### Capas por Slice

Cada slice vertical contiene las siguientes capas:

| Capa | Dependencias | Responsabilidad |
|---|---|---|
| **domain/model/** | Ninguna | Entidades puras, value objects |
| **domain/port/** | Ninguna | Interfaces de puerto (input/output) |
| **application/usecase/** | domain | Casos de uso, lógica de negocio |
| **application/dto/** | — | Request/Response DTOs |
| **infrastructure/persistence/** | — | Entidades JPA, repositorios, adapters |
| **infrastructure/web/** | — | Controladores REST |

### Reglas de Dependencia

- **Domain** → sin dependencias externas (ni siquiera Spring)
- **Application** → depende solo de Domain
- **Infrastructure** → depende de Application y Domain

La flecha de dependencia siempre apunta **hacia adentro** del hexágono.

---

## Flujo de una Petición

```
Cliente HTTP
    ↓
[SecurityFilterChain (JWT + OAuth2)]
    ↓
DispatcherServlet
    ↓
Controller (infrastructure/web)    ← Adaptador de entrada (REST)
    ↓
UseCase (application/usecase)      ← Puerto de entrada
    ↓
Port interface (domain/port)       ← Puerto de salida
    ↓
RepositoryAdapter (infrastructure/persistence)  ← Adaptador de salida (JPA)
    ↓
PostgreSQL
```

---

## Vertical Slices Definidos

| Slice | Responsabilidad |
|---|---|
| **auth** | Autenticación local (JWT) + Google OAuth2 |
| **user** | Usuarios (herencia SINGLE_TABLE) + direcciones |
| **category** | Categorías con jerarquía padre-hijo |
| **product** | Catálogo de productos + reseñas |
| **cart** | Carrito de compras + wishlist |
| **order** | Pedidos, pagos, envíos, cupones |

---

## Modelo de Datos (14 tablas)

### user slice
| Tabla | PK | FK | Notas |
|---|---|---|---|
| `users` | UUID | — | Herencia SINGLE_TABLE, discriminador `tipo` |
| `direcciones` | UUID | usuario_id → users | — |

### category slice
| Tabla | PK | FK |
|---|---|---|
| `categorias` | UUID | padre_id → categorias |

### product slice
| Tabla | PK | FK |
|---|---|---|
| `productos` | UUID | categoria_id → categorias |
| `resenias` | UUID | usuario_id → users, producto_id → productos |

### cart slice
| Tabla | PK | FK |
|---|---|---|
| `carritos` | UUID | usuario_id → users |
| `carrito_items` | UUID | carrito_id → carritos, producto_id → productos |
| `wishlists` | UUID | usuario_id → users |
| `wishlist_items` | UUID | wishlist_id → wishlists, producto_id → productos |

### order slice
| Tabla | PK | FK |
|---|---|---|
| `pedidos` | UUID | usuario_id → users, direccion_id → direcciones, staff_id → users, cupon_id → cupones |
| `pedido_items` | UUID | pedido_id → pedidos, producto_id → productos |
| `pagos` | UUID | pedido_id → pedidos |
| `envios` | UUID | pedido_id → pedidos |
| `cupones` | UUID | — |

---

## Endpoints

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | — | Registro de cliente |
| POST | `/api/auth/login` | — | Login email+password |
| POST | `/api/auth/google` | — | Login Google (mobile) |
| GET | `/oauth2/authorization/google` | — | Login Google (browser) |
| GET | `/api/auth/callback` | — | Callback post-OAuth2 |

### Productos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/products` | — | Listar productos activos |
| GET | `/api/products/{id}` | — | Detalle producto |
| GET | `/api/products/by-category/{categoriaId}` | — | Filtrar por categoría |
| POST | `/api/admin/products` | ADMIN | Crear producto |
| PUT | `/api/admin/products/{id}` | ADMIN | Actualizar producto |
| DELETE | `/api/admin/products/{id}` | ADMIN | Desactivar producto |

### Categorías

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/categories` | — | Listar categorías |
| GET | `/api/categories/{id}` | — | Detalle categoría |
| POST | `/api/admin/categories` | ADMIN | Crear categoría |
| PUT | `/api/admin/categories/{id}` | ADMIN | Actualizar categoría |
| DELETE | `/api/admin/categories/{id}` | ADMIN | Eliminar categoría |

### Carrito

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/cart` | CLIENT | Ver carrito |
| POST | `/api/cart/items` | CLIENT | Agregar item |
| DELETE | `/api/cart/items/{id}` | CLIENT | Eliminar item |
| DELETE | `/api/cart` | CLIENT | Vaciar carrito |

### Pedidos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/orders` | CLIENT | Crear pedido |
| GET | `/api/orders` | CLIENT | Mis pedidos |
| GET | `/api/orders/{id}` | CLIENT | Detalle pedido |

### Reseñas

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/reviews/product/{productoId}` | — | Reseñas de un producto |
| POST | `/api/reviews` | CLIENT | Crear reseña |
| DELETE | `/api/reviews/{id}` | CLIENT | Eliminar reseña propia |

### Wishlist

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/wishlist` | CLIENT | Ver wishlist |
| POST | `/api/wishlist/items` | CLIENT | Agregar producto |
| DELETE | `/api/wishlist/items/{id}` | CLIENT | Eliminar item |

### Direcciones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/direcciones` | CLIENT | Mis direcciones |
| POST | `/api/direcciones` | CLIENT | Agregar dirección |
| DELETE | `/api/direcciones/{id}` | CLIENT | Eliminar dirección |

### Cupones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/coupons/{codigo}` | — | Consultar cupón |

### Admin

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/admin/orders` | ADMIN | Todos los pedidos |
| PUT | `/api/admin/orders/{id}/status` | ADMIN | Cambiar estado pedido |

---

## Roles

| Rol | Usuarios |
|---|---|
| `ROLE_CLIENT` | Clientes registrados (vía register o Google) |
| `ROLE_ADMIN` | Administradores |
| `ROLE_STAFF` | Vendedores/staff |

---

## Dependencias Principales (pom.xml)

- **spring-boot-starter-webmvc** — API REST con Spring MVC.
- **spring-boot-starter-data-jpa** — ORM con Hibernate + JPA.
- **spring-boot-starter-security-oauth2-client** — Autenticación via Google OAuth2.
- **spring-boot-starter-validation** — Validación con Jakarta Bean Validation.
- **springdoc-openapi-starter-webmvc-ui** — Swagger UI + OpenAPI 3.
- **postgresql** — Driver de PostgreSQL.
- **jjwt-api / jjwt-impl / jjwt-jackson** — 0.12.6 — Generación y validación de JWT.
- **spring-security-crypto** — BCrypt para hash de contraseñas.
- **h2** — Base de datos embebida para tests.

---

## Documentación de Módulos

| Archivo | Descripción |
|---|---|
| `docs/arquitectura.md` | Esta página — visión general, stack, estructura, endpoints |
| `docs/autenticacion.md` | Autenticación local y Google OAuth2, JWT, roles |
| `docs/usuarios.md` | Usuarios (herencia, roles) y direcciones |
| `docs/categorias.md` | Categorías públicas y admin |
| `docs/productos.md` | Productos y reseñas |
| `docs/carrito.md` | Carrito de compras y wishlist |
| `docs/pedidos.md` | Pedidos, pagos, envíos y cupones |
| `docs/errores.md` | Manejo de errores y códigos HTTP |

---

## Estado del Proyecto

API completamente implementada con 14 tablas en PostgreSQL, autenticación JWT + OAuth2, CRUD completo de productos/categorías/pedidos, carrito, wishlist, reseñas, direcciones, cupones y role-based access control.
