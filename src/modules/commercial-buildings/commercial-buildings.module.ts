import { Module } from '@nestjs/common';
import { CommercialBuildingsService } from './commercial-buildings.service';
import { CommercialBuildingsController } from './commercial-buildings.controller';

@Module({
  providers: [CommercialBuildingsService],
  controllers: [CommercialBuildingsController]
})
export class CommercialBuildingsModule {}
