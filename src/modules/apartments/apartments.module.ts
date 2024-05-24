import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentEntity } from './apartment.entity';
import { BuildingsModule } from '../../modules/buildings/buildings.module';

@Module({
  imports : [ TypeOrmModule.forFeature([ ApartmentEntity ])  , BuildingsModule],
  providers: [ApartmentsService],
  controllers: [ApartmentsController],
})

export class ApartmentsModule {}
