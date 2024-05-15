import './boilerplate.polyfill';
import { join } from 'path';
import dotenv from 'dotenv';



dotenv.config();


// DB_TYPE=postgres
// DB_HOST=ep-nameless-shadow-a5y0kz4v-pooler.us-east-2.aws.neon.tech
// DB_PORT=5432
// DB_USERNAME=brustnika-backend_owner
// DB_PASSWORD=F3hVBAbmWUY6
// DB_DATABASE=brustnika-backend

module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: true,
  logging: true,
  synchronize: true,
  entities: [
    join(__dirname, '/**/*.entity{.ts,.js}'),
    join(__dirname, '/**/*.view-entity{.ts,.js}'),
  ],

  migrations: [join(__dirname, 'src/database/migrations/*{.ts,.js}')],
  
};


// dataSource.initialize();
