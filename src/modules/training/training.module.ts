import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingEntity } from './training.entity';

@Module({
  imports : [ TypeOrmModule.forFeature([ TrainingEntity])],
  controllers: [TrainingController],
  providers: [TrainingService]
})
export class TrainingModule {}



/*
     Training crud done 

     Should be added file uploading(like news )
     ( Update news file upload )
     ( Fix the url of the file link)
     
*/