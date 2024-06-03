import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsEntity } from './buildings.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([ BuildingsEntity])
  ],
  controllers: [BuildingsController],
  providers: [BuildingsService],
  exports : [ BuildingsService]
})
export class BuildingsModule {}
