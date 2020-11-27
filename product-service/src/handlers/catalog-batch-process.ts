import { SQSHandler } from 'aws-lambda';
import { Product } from '../models/product.model';
import { connectDb } from '../common/connect-db';
import { Client } from 'pg';
import SNS from 'aws-sdk/clients/sns';
import AWS from 'aws-sdk';

export const catalogBatchProcess: SQSHandler = async (event) => {
  const products: string[] = event.Records.map((data) => data.body);
  const client: Client = await connectDb();
  const sns: SNS = new AWS.SNS({ region: 'eu-west-1' });

  for (const json of products) {
    try {
      const entity: Product = JSON.parse(json);
      const { title, description, price, count } = entity;

      await client.query('BEGIN');

      const insertProduct = 'INSERT INTO products(title, description, price) values($1, $2, $3) RETURNING id';
      const {
        rows: [{ id }],
      } = await client.query(insertProduct, [title, description, price]);
      const insertStock = 'INSERT INTO stock(count, product_id) values($1, $2)';

      await client.query(insertStock, [count, id]);

      const {
        rows: [item],
      } = await client.query(
        `
        SELECT p.id, p.description, p.price, p.title, s.count FROM products p 
          LEFT JOIN stock s on p.id=s.product_id WHERE p.id=$1
      `,
        [id],
      );

      await client.query('COMMIT');

      const counts: string = item.count < 2 ? 'run out' : 'good';

      const message = await sns
        .publish({
          Subject: 'Products successful added',
          Message: JSON.stringify(item),
          MessageAttributes: {
            counts: {
              DataType: 'String',
              StringValue: counts,
            },
          },
          TopicArn: process.env.SNS_ARN,
        })
        .promise();
      console.log('SNS message: ', message);
    } catch (err) {
      console.log(err);
    }
  }
};
