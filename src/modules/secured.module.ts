import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { PostModule } from "./post/post.module";
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    // PostModule,
    HealthCheckerModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [],
})
export class SecuredModule {}
