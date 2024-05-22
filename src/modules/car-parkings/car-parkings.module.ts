import { Module } from '@nestjs/common';
import { CarParkingsController } from './car-parkings.controller';
import { CarParkingsService } from './car-parkings.service';

@Module({
  controllers: [CarParkingsController],
  providers: [CarParkingsService]
})
export class CarParkingsModule {}
