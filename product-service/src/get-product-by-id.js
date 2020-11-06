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

export const getProductById = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  let statusCode;
  let body;

  try {
    const {id} = event.pathParameters;
    const isUuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
    if (isUuid) {
      const {rows} = await client.query(`SELECT * FROM products WHERE id=$1`, [id]);
      const [product] = rows.length ? rows : null;
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
      },
      statusCode: 500,
      body: 'Internal Server Error'
    };
  } finally {
    client.end();
  }
};

