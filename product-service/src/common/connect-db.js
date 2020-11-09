import { Client } from 'pg';
import { dbOptions } from './db-options';

export const connectDb = async () => {
  try {
    const client = new Client(dbOptions);
    await client.connect();
    return client;
  } catch {
    return null;
  }
};
