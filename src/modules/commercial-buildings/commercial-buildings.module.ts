import { Module } from '@nestjs/common';
import { CommercialBuildingsService } from './commercial-buildings.service';
import { CommercialBuildingsController } from './commercial-buildings.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommercialBuildingsEntity } from './commercial.entity';

@Module({

  imports : [
    TypeOrmModule.forFeature([ CommercialBuildingsEntity ])
  ],
  providers: [CommercialBuildingsService],
  controllers: [CommercialBuildingsController]
})
export class CommercialBuildingsModule {}
