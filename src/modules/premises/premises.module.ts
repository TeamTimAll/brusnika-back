import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremisesController } from './premises.controller';
import { PremisesEntity } from './premises.entity';
import { PremisesService } from './premises.service';

@Module({
  imports: [TypeOrmModule.forFeature([PremisesEntity])],
  providers: [PremisesService],
  controllers: [PremisesController],
})
export class PremisesModule {}
