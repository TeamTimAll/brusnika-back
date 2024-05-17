import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    AuthModule,
    HealthCheckerModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [],
})
export class SecuredModule {}
