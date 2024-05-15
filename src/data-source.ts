import './boilerplate.polyfill';
import { join } from 'path';
import dotenv from 'dotenv';

// import { UserSubscriber } from './entity-subscribers/user-subscriber';
// import { SnakeNamingStrategy } from './snake-naming.strategy';

dotenv.config();

module.exports = {
  type: "postgres",
  host: "ep-nameless-shadow-a5y0kz4v-pooler.us-east-2.aws.neon.tech",
  port: 5432,
  username: "brustnika-backend_owner",
  password: "F3hVBAbmWUY6",
  database: "brustnika-backend",
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
