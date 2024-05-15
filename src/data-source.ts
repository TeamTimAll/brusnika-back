import './boilerplate.polyfill';
import { join } from 'path';
import dotenv from 'dotenv';

// import { UserSubscriber } from './entity-subscribers/user-subscriber';
// import { SnakeNamingStrategy } from './snake-naming.strategy';

dotenv.config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  synchronize: true,
  entities: [
    join(__dirname, '/**/*.entity{.ts,.js}'),
    join(__dirname, '/**/*.view-entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, 'src/database/migrations/*{.ts,.js}')],
};


// dataSource.initialize();
