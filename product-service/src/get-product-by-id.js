import { Client } from 'pg';
import { dbOptions } from './common/db-options';

export const getProductById = async event => {
  console.log('getProductById EVENT: ', event);

  const client = new Client(dbOptions);

  let statusCode;
  let body;

  try {
    await client.connect();

    const {id} = event.pathParameters;
    const isUuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
    if (isUuid) {
      const {rows} = await client.query(`
        SELECT p.id, p.description, p.price, p.title, s.count FROM products p 
          LEFT JOIN stock s on p.id=s.product_id WHERE p.id=$1
      `, [id]);
      const [product] = rows.length ? rows : [null];
      statusCode = product ? 200 : 404;
      body = product ? JSON.stringify(product) : 'Not Found';
    } else {
      statusCode = 403;
      body = 'Bad request'
    }

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': statusCode === 200 ? 'application/json' : 'text/html',
      },
      statusCode,
      body
    };
  } catch (err) {
    console.error(err);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'text/html',
      },
      statusCode: 500,
      body: 'Internal Server Error'
    };
  } finally {
    client.end();
  }
};

