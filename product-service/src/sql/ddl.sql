CREATE extension if NOT EXISTS "uuid-ossp";

CREATE TABLE if NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  count int,
  description text,
  price int,
  title VARCHAR(255)
);
