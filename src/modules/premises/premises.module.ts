import { Module } from '@nestjs/common';
import { PremisesService } from './premises.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremisesEntity } from './premise.entity';
import { PremisesController } from './premises.controller';

@Module({

  imports : [
     TypeOrmModule.forFeature([ PremisesEntity ])
  ],
  providers: [PremisesService],
  controllers: [PremisesController],
  exports : [ PremisesService ]
})

export class PremisesModule {}
