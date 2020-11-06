import { Client } from 'pg';

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

export const getProducts = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const ddlResult = await client.query(`
      CREATE extension if NOT EXISTS "uuid-ossp"
    `);

    const ddlResult2 = await client.query(`
      CREATE TABLE if NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        count int,
        description text,
        price int,
        title VARCHAR(255)
      )
    `);
    const dmlResult = await client.query(`
      CREATE TABLE if NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        count int,
        description text,
        price int,
        title VARCHAR(255)
      )
    `);
    const {rows: productList} = await client.query(`SELECT * FROM products`);

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
      },
      statusCode: 500,
      body: 'Internal Server Error'
    };
  } finally {
    client.end();
  }

};
