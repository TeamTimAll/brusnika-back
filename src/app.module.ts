import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecuredModule } from './modules/secured.module';
import { config } from 'dotenv';
import { CommentsModule } from './modules/comments/comments.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ClientsModule } from './modules/clients/clients.module';
import * as AppDataSource from './data-source';

config()


// const sql: object = {
//   type: process.env.DB_TYPE,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database:process.env.DB_DATABASE,
//   ssl: true
  
// };

 


// const sql: object = {
//   type: "postgres",
//   host: "ep-nameless-shadow-a5y0kz4v-pooler.us-east-2.aws.neon.tech",
//   port: 5432,
//   username: "brustnika-backend_owner",
//   password: "F3hVBAbmWUY6",
//   database: "brustnika-backend",
//   ssl: true,
//   migrations: [ "../src/database/migrations"],

// };




@Module({
  imports: [SecuredModule, 
    TypeOrmModule.forRoot(AppDataSource), CommentsModule, ClientsModule,
  ],
  providers: [],
})

export class AppModule {}

// ClsModule.forRoot({
//   global: true,
//   middleware: {
//     mount: true,
//   },
// }),


// ThrottlerModule.forRootAsync({
//   imports: [SharedModule],
//   useFactory: (configService: ApiConfigService) => ({
//     throttlers: [configService.throttlerConfigs],
//   }),
//   inject: [ApiConfigService],
// }),
// ConfigModule.forRoot({
//   isGlobal: true,
//   envFilePath: '.env',
// })
// TypeOrmModule.forRootAsync({
//   imports: [SharedModule],
//   useFactory: (configService: ApiConfigService) =>
//     configService.postgresConfig,
//   inject: [ApiConfigService],
//   dataSourceFactory: (options) => {
//     if (!options) {
//       throw new Error('Invalid options passed');
//     }
//     return Promise.resolve(
//       addTransactionalDataSource(new DataSource(options)),
//     );
//   },
// })

// I18nModule.forRootAsync({
//   useFactory: (configService: ApiConfigService) => ({
//     fallbackLanguage: configService.fallbackLanguage,
//     loaderOptions: {
//       path: path.join(__dirname, '/i18n/'),
//       watch: configService.isDevelopment,
//     },
//     resolvers: [
//       { use: QueryResolver, options: ['lang'] },
//       AcceptLanguageResolver,
//       new HeaderResolver(['x-lang']),
//     ],
//   }),
//   imports: [SharedModule],
//   inject: [ApiConfigService],
// }),
