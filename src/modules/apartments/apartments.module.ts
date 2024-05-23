import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentEntity } from './apartment.entity';
import { PremisesModule } from '../../modules/premises/premises.module';

@Module({
  
  imports : [ TypeOrmModule.forFeature([ ApartmentEntity ]) , PremisesModule],
  providers: [ApartmentsService],
  controllers: [ApartmentsController],
  exports : [ ApartmentsService]
})

export class ApartmentsModule {}
