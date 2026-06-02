# Glow Cart — Backend

API REST para tienda de accesorios. Construida con Node.js, Express y TypeScript, conectada a Supabase como base de datos PostgreSQL. Autenticación JWT exclusiva para administradores.

---

## 🛠️ Tecnologías

- **Node.js + Express** — servidor y rutas
- **TypeScript** — tipado estático
- **Supabase** — base de datos PostgreSQL real (sin Supabase Auth)
- **JWT + bcrypt** — autenticación segura
- **Swagger** — documentación interactiva en `/api/docs`

---

## 🗂️ Arquitectura limpia

```
src/
├── domain/
│   ├── entities/           → Product, Collection, Order, Admin
│   └── repositories/       → Interfaces (contratos)
│
├── application/
│   └── use-cases/
│       ├── auth/            → LoginAdmin, RegisterAdmin
│       ├── product/         → GetAll, GetById, Create, Update, Delete
│       ├── collection/      → GetAll, GetBySlug, Create, Update
│       └── order/           → GetAll, GetById, Create, UpdateStatus
│
├── infrastructure/
│   ├── auth/                → jwt.ts
│   └── database/
│       └── repositories/    → Implementaciones con Supabase
│
├── interfaces/
│   ├── controllers/         → authController, productController, etc.
│   ├── routes/              → rutas con JSDoc para Swagger
│   └── middlewares/         → requireAdmin, requireSuperAdmin, errorHandler, logger
│
├── swagger.ts               → Configuración Swagger UI
└── index.ts                 → Entry point
```

---

## 🚀 Setup local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/glow-cart-back.git
cd glow-cart-back

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar: SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET, JWT_EXPIRES_IN

# 4. Crear tablas en Supabase
# Ir a Supabase Dashboard → SQL Editor → pegar y ejecutar supabase/schema.sql

# 5. Correr en desarrollo
npm run dev
```

- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`

---

## 🔑 Variables de entorno

```env
PORT=4000
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
```

---

## 📡 Endpoints

### Auth
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/auth/login` | ❌ | Login admin → devuelve JWT |
| POST | `/api/v1/auth/register` | ✅ superadmin | Registrar nuevo admin |
| GET | `/api/v1/auth/me` | ✅ | Ver admin autenticado |

### Productos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/products` | ❌ | Todos los productos (paginado) |
| GET | `/api/v1/products?category=slug` | ❌ | Filtrar por categoría |
| GET | `/api/v1/products?collection=slug` | ❌ | Filtrar por colección |
| GET | `/api/v1/products?page=1&limit=20` | ❌ | Paginación |
| GET | `/api/v1/products/:id` | ❌ | Producto por ID |
| POST | `/api/v1/products` | ✅ admin | Crear producto |
| PUT | `/api/v1/products/:id` | ✅ admin | Editar producto |
| DELETE | `/api/v1/products/:id` | ✅ superadmin | Eliminar producto |

### Colecciones
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/collections` | ❌ | Todas las colecciones |
| GET | `/api/v1/collections/:slug` | ❌ | Colección por slug |
| POST | `/api/v1/collections` | ✅ admin | Crear colección |
| PUT | `/api/v1/collections/:slug` | ✅ admin | Editar colección |

### Pedidos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/orders` | ❌ | Crear pedido |
| GET | `/api/v1/orders` | ✅ admin | Ver todos los pedidos |
| GET | `/api/v1/orders/:id` | ✅ admin | Ver pedido por ID |
| PATCH | `/api/v1/orders/:id` | ✅ admin | Actualizar estado |

### General
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |

---

## 🔐 Roles

| Rol | Permisos |
|-----|----------|
| `superadmin` | Todo — incluyendo eliminar productos y registrar admins |
| `admin` | Crear y editar productos, ver y gestionar pedidos |

---

## 📄 Respuesta paginada

Los endpoints de listado devuelven:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## 🗄️ Base de datos

Tablas en Supabase:
- `products` — productos de la tienda
- `collections` — colecciones estéticas
- `orders` — pedidos
- `order_items` — items de cada pedido
- `admin_users` — administradores con rol y password hasheada