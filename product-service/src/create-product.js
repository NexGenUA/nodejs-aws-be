import { Client } from 'pg';
import { dbOptions } from './common/db-options';

export const createProduct = async event => {
  console.log('createProduct EVENT: ', event);

  const client = new Client(dbOptions);

  try {
    await client.connect();

    const entity = JSON.parse(event.body);
    const {title, description, price, count} = entity;
    await client.query('BEGIN');
    const insertProduct = 'INSERT INTO products(title, description, price) values($1, $2, $3) RETURNING id';
    const { rows: [{id}] } = await client.query(insertProduct, [title, description, price]);
    const insertStock = 'INSERT INTO stock(count, product_id) values($1, $2)';
    await client.query(insertStock, [count, id]);
    const {rows} = await client.query(`
        SELECT p.id, p.description, p.price, p.title, s.count FROM products p 
          LEFT JOIN stock s on p.id=s.product_id WHERE p.id=$1
      `, [id]);
    await client.query('COMMIT');

    const [product] = rows;

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      statusCode: 201,
      body: JSON.stringify(product)
    };
  } catch (err) {
    await client.query('ROLLBACK');

    console.error(err);

    let statusCode = 500;
    let body = 'Internal Server Error';
    let contentType = 'text/html';

    if (err.code === '23505') {
      contentType = 'application/json';
      statusCode = 409;
      body = JSON.stringify({
        message: err.detail.replace(/Key/i, 'Product with')
      });
    }

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': contentType,
      },
      statusCode,
      body
    };
  } finally {
    client.end();
  }
};

