-- ─── Ejecutar en el SQL Editor de Supabase ───────────────────────────────────

-- PRODUCTS
create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  price           numeric(10,2) not null,
  description     text,
  image           text,
  category_slug   text not null,
  collection_slug text,
  stock           int not null default 0,
  badge           text,
  is_best_seller  boolean default false,
  is_new          boolean default false,
  created_at      timestamptz default now()
);

-- COLLECTIONS
create table if not exists collections (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  description  text,
  cover_image  text,
  banner_image text,
  palette      text,
  created_at   timestamptz default now()
);

-- ORDERS
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  customer_email text not null,
  total          numeric(10,2) not null,
  status         text not null default 'pendiente'
                   check (status in ('pendiente','enviado','entregado')),
  created_at     timestamptz default now()
);

-- ORDER ITEMS
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid not null,
  product_name  text not null,
  product_image text,
  price         numeric(10,2) not null,
  quantity      int not null default 1
);

-- ADMIN USERS
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz default now()
);

-- ─── Insertar admin inicial ───────────────────────────────────────────────────
-- Reemplaza el hash con el resultado de: bcrypt.hash("tu_password", 10)
-- O usa el script: npm run seed
insert into admin_users (email, password_hash)
values ('admin@glowcart.com', '$2b$10$PLACEHOLDER_REEMPLAZAR_CON_HASH_REAL')
on conflict (email) do nothing;

-- ─── Colecciones iniciales ────────────────────────────────────────────────────
insert into collections (name, slug, description, cover_image, banner_image, palette) values
  ('Angelic Silvery',     'angelic-silvery', 'Plata, azul cielo y rosa pálido. Etérea y angelical.',              '/images/collections/angelic-silvery-collection.jfif',  '/images/collections/angelic-silvery-collection-pagina.jfif',  'Plata · Azul · Blanco · Rosa claro'),
  ('Neapolitan Chocolate','neapolitan',       'Café, rosa y crema. Dulce y nostálgica como el helado napolitano.', '/images/collections/neapolitan-collection.jfif',         '/images/collections/neapolitan-collection-pagina.jfif',        'Café · Rosa · Crema · Amarillo claro'),
  ('Vampire Goth',        'vampire-goth',     'Negro y rojo vino. Gótica, intensa y poderosa.',                   '/images/collections/vampire-goth-collection.jfif',       '/images/collections/vampire-goth-collection-pagina.jfif',      'Negro · Rojo vino · Gris oscuro')
on conflict (slug) do nothing;
