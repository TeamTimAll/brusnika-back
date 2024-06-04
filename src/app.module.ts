import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigManager } from './config';
import { SecuredModule } from './modules/secured.module';

@Module({
  imports: [
    SecuredModule,
    TypeOrmModule.forRoot(ConfigManager.databaseConfig),
    MulterModule.register({
      dest: '../media',
    }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
