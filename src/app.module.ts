import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecuredModule } from './modules/secured.module';
import * as AppDataSource from './data-source';
import { config } from 'dotenv';
config();

@Module({
  imports: [SecuredModule, TypeOrmModule.forRoot(AppDataSource)],
  providers: [],
  controllers: [],
})
export class AppModule {}

// @Module({
//   imports: [
//       ConfigModule.forRoot({
//           load: [configuration],
//           isGlobal: true,
//       }),
//       SharedModule,
//       DatabaseModule,
//       AgencyModule, //ADD HERE

//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
// ClsModule.forRoot({
//   global: true,
//   middleware: {
//     mount: true,
//   },
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
