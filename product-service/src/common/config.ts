import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const config = {
  PG_HOST: process.env.PG_HOST,
  PG_PORT: process.env.PG_PORT,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_USERNAME: process.env.PG_USERNAME,
  PG_PASSWORD: process.env.PG_PASSWORD,
  EMAIL: process.env.EMAIL,
  EMAIL_TROUBLE: process.env.EMAIL_TROUBLE,
};
