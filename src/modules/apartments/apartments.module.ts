import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentEntity } from './apartment.entity';

@Module({
  
  imports : [ TypeOrmModule.forFeature([ ApartmentEntity ])],
  providers: [ApartmentsService],
  controllers: [ApartmentsController],
  exports : [ ApartmentsService]
})

export class ApartmentsModule {}
