import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { EventsModule } from './events/events.module';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientModule } from './client/client.module';
import { ClientStatusModule } from './client-status/client-status.module';
import { TrainingModule } from './training/training.module';
import { DealsModule } from './deals/deals.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CitiesModule } from './cities/cities.module';
import { BuildingsModule } from './buildings/buildings.module';
import { SectionsModule } from './sections/sections.module';
import { PremisesModule } from './premises/premises.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/api/files',
    }),
    UserModule,
    EventsModule,
    AuthModule,
    HealthCheckerModule,
    ClientModule,
    ClientStatusModule,
    TrainingModule,
    DealsModule,
    CitiesModule,
    NewsModule,
    CommentsModule,
    ProjectsModule,
    BuildingsModule,
    PremisesModule,
    SectionsModule,
  ],
  exports: [],
})
export class SecuredModule {}
