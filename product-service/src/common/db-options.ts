import { ClientConfig } from 'pg';
import { config } from './config';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = config;

export const dbOptions: ClientConfig = {
  host: PG_HOST,
  port: parseInt(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
