import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecuredModule } from './modules/secured.module';
import { config } from 'dotenv';



config()



const sql: object = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE,
  ssl: true
};



@Module({
  imports: [SecuredModule, 
    TypeOrmModule.forRoot({...sql}),
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
