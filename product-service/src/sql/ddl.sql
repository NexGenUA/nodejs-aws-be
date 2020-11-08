CREATE extension if NOT EXISTS "uuid-ossp";

CREATE TABLE if NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  description text,
  price int,
  title VARCHAR(255) UNIQUE
);

CREATE TABLE if NOT EXISTS stock (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid references products(id) ON DELETE CASCADE,
  count int,
  UNIQUE (product_id)
)
