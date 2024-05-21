import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { PremisesModule } from '../../modules/premises/premises.module';

@Module({
  imports : [ 
    PremisesModule,
    TypeOrmModule.forFeature([ ProjectEntity])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})

export class ProjectsModule {}
