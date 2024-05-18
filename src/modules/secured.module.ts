import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { EventsModule } from './events/events.module';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    UserModule,
    EventsModule,
    AuthModule,
    ClientsModule,
    NewsModule,
    CommentsModule,
    ProjectsModule,
    HealthCheckerModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [],
})
export class SecuredModule {}
