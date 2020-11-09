import { connectDb } from './common/connect-db';
import { res } from './common/res';

export const createProduct = async event => {
  console.log('createProduct EVENT: ', event);

  const client = await connectDb();

  if (!client) {
    return res().sendInternal();
  }

  try {
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

    return res().status(201).json(product);
  } catch (err) {
    await client.query('ROLLBACK');

    console.error(err);

    if (err.code === '23505') {
      return res().status(409).json({
        message: err.detail.replace(/Key/i, 'Product with')
      });
    }

    return res().sendInternal();
  } finally {
    client.end();
  }
};

