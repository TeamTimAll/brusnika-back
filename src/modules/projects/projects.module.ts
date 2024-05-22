import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { PremisesModule } from '../../modules/premises/premises.module';
import path from 'path';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports : [ 
    PremisesModule,
    MulterModule.register({
      dest :path.join(__dirname, "..",  "media")
   }),

    TypeOrmModule.forFeature([ ProjectEntity])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})

export class ProjectsModule {}
