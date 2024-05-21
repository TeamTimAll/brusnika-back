import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { PostModule } from "./post/post.module";
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { EventsModule } from './events/events.module';
import { PremisesModule } from './premises/premises.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    AuthModule,
    // PostModule,
    HealthCheckerModule,
    TypeOrmModule.forFeature([UserEntity]),
    PremisesModule,
  ],
  exports: [],
})
export class SecuredModule {}
