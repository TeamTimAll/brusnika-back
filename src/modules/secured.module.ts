import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { EventsModule } from './events/events.module';
import { PremisesModule } from './premises/premises.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    AuthModule,
    HealthCheckerModule,
    TypeOrmModule.forFeature([UserEntity]),
    PremisesModule,
    ProjectsModule
  ],
  exports: [],
})
export class SecuredModule {}
