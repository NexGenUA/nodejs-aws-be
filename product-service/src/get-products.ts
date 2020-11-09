import { connectDb } from './common/connect-db';
import { res } from './common/res';
import { Client } from 'pg';

export const getProducts = async event => {
  console.log('getProducts EVENT: ', event);

  const client: Client = await connectDb();

  if (!client) {
    return res().sendInternal();
  }

  try {

    await client.query(`
      CREATE extension if NOT EXISTS "uuid-ossp"
    `);

    await client.query(`
      CREATE TABLE if NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        description text,
        price int,
        title VARCHAR(255) UNIQUE
      )
    `);

    await client.query(`
      CREATE TABLE if NOT EXISTS stock (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id uuid references products(id) ON DELETE CASCADE,
        count int,
        UNIQUE (product_id)
      )
    `);

    const {rows: productList} = await client.query(`
      SELECT p.id, p.description, p.price, p.title, s.count FROM products p LEFT JOIN stock s on p.id=s.product_id
    `);

    return res().json(productList);
  } catch (err) {
    console.error(err);
    return res().sendInternal();
  } finally {
    await client.end();
  }
};
