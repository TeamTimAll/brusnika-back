import { Module } from '@nestjs/common';
import { CarParkingsController } from './car-parkings.controller';
import { CarParkingsService } from './car-parkings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarParkingEntity } from './carParking.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([ CarParkingEntity ])
  ],
  controllers: [CarParkingsController],
  providers: [CarParkingsService]
})
export class CarParkingsModule {}
