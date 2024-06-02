import './src/boilerplate.polyfill';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from './src/snake-naming.strategy';
import { join } from 'path';
import fs from 'fs'
dotenv.config();
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    ca: fs.readFileSync('postgresql.pem').toString(),
    rejectUnauthorized: true,
  },
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    join(__dirname, '/**/*.entity{.ts,.js}'),
    join(__dirname, '/**/*.view-entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, 'src/database/migrations/*{.ts,.js}')],
  synchronize: true,
  logging: true,
});

// export const dataSourceProd = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   ssl: {
//     ca: process.env.SSL_CERT,
//   },
//   namingStrategy: new SnakeNamingStrategy(),
//   entities: [
//     join(__dirname, '/**/*.entity{.ts,.js}'),
//     join(__dirname, '/**/*.view-entity{.ts,.js}'),
//   ],
//   migrations: [join(__dirname, 'src/database/migrations/*{.ts,.js}')],
//   synchronize: true,
//   logging: true,
// });
