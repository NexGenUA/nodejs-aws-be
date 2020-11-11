import { connectDb } from './common/connect-db';
import { res } from './common/res';
import { Client } from 'pg';

export const getProductById = async event => {
  console.log('getProductById EVENT: ', event);

  const client: Client = await connectDb();

  if (!client) {
    return res().sendInternal();
  }

  try {
    const {id} = event.pathParameters;
    const isUuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
    if (isUuid) {
      const {rows} = await client.query(`
        SELECT p.id, p.description, p.price, p.title, s.count FROM products p 
          LEFT JOIN stock s on p.id=s.product_id WHERE p.id=$1
      `, [id]);
      const [product] = rows.length ? rows : [null];

      if (product) {
        return res().json(product);
      }
      return res().status(404).send('Not Found')
    }

    return res().status(403).send('Bad Request');

  } catch (err) {
    console.error(err);
    return res().sendInternal();
  } finally {
    await client.end();
  }
};

