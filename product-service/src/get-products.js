import { Client } from 'pg';
import { dbOptions } from './common/db-options';

export const getProducts = async event => {
  console.log('getProducts EVENT: ', event);

  const client = new Client(dbOptions);

  try {
    await client.connect();

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

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: JSON.stringify(productList)
    };
  } catch (err) {
    console.error(err);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'text/html'
      },
      statusCode: 500,
      body: 'Internal Server Error'
    };
  } finally {
    client.end();
  }
};
