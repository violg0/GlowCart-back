# Glow Cart — Backend

API REST con Node.js + Express + TypeScript + Supabase + Swagger. JWT solo para admin.

## 🗂️ Arquitectura limpia

```
src/
├── domain/
│   ├── entities/          → Product, Collection, Order, Admin (tipos puros)
│   └── repositories/      → Interfaces (contratos) — IProductRepository, etc.
│
├── application/
│   └── use-cases/
│       ├── auth/          → LoginAdmin
│       ├── product/       → GetAll, GetById, Create, Update, Delete
│       ├── collection/    → GetAll, GetBySlug, Create, Update
│       └── order/         → GetAll, GetById, Create, UpdateStatus
│
├── infrastructure/
│   ├── auth/              → jwt.ts — signToken, verifyToken
│   └── database/
│       └── repositories/  → Implementaciones con Supabase
│
├── interfaces/
│   ├── controllers/       → authController, productController, etc.
│   ├── routes/            → authRoutes, productRoutes, etc. (con JSDoc Swagger)
│   └── middlewares/       → requireAdmin, errorHandler, logger
│
├── swagger.ts             → Configuración de Swagger UI
└── index.ts               → Entry point
```

## 🚀 Setup

```bash
# 1. Copiar variables de entorno
cp .env.example .env
# → Completar SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET

# 2. Crear tablas en Supabase
# → Ir a Supabase Dashboard → SQL Editor → pegar contenido de supabase/schema.sql

# 3. Instalar dependencias
npm install

# 4. Correr en desarrollo
npm run dev
```

API en: `http://localhost:4000`
Swagger en: `http://localhost:4000/api/docs`

## 📡 Endpoints

| Método | Ruta                        | Auth  | Descripción                    |
|--------|-----------------------------|-------|--------------------------------|
| POST   | /api/auth/login             | ❌    | Login admin → JWT              |
| GET    | /api/auth/me                | ✅    | Ver admin autenticado          |
| GET    | /api/products               | ❌    | Todos los productos            |
| GET    | /api/products?category=slug | ❌    | Filtrar por categoría          |
| GET    | /api/products?collection=slug| ❌   | Filtrar por colección          |
| GET    | /api/products/:id           | ❌    | Producto por ID                |
| POST   | /api/products               | ✅    | Crear producto                 |
| PUT    | /api/products/:id           | ✅    | Editar producto                |
| DELETE | /api/products/:id           | ✅    | Eliminar producto              |
| GET    | /api/collections            | ❌    | Todas las colecciones          |
| GET    | /api/collections/:slug      | ❌    | Colección por slug             |
| POST   | /api/collections            | ✅    | Crear colección                |
| PUT    | /api/collections/:slug      | ✅    | Editar colección               |
| POST   | /api/orders                 | ❌    | Crear pedido                   |
| GET    | /api/orders                 | ✅    | Ver todos los pedidos          |
| GET    | /api/orders/:id             | ✅    | Ver pedido por ID              |
| PATCH  | /api/orders/:id             | ✅    | Actualizar estado del pedido   |
| GET    | /api/health                 | ❌    | Health check                   |

## 🔐 Admin inicial

Después de correr el SQL, el hash del admin es un placeholder.
Para generar el hash real de tu contraseña, ejecuta en Node:

```js
const bcrypt = require("bcryptjs");
bcrypt.hash("tu_password", 10).then(console.log);
```

Pega el resultado en la tabla `admin_users` de Supabase.
