import { Module } from '@nestjs/common';
import { PremisesService } from './premises.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremisesEntity } from './premise.entity';

@Module({

  imports : [
   
     TypeOrmModule.forFeature([ PremisesEntity ])
    ],
  providers: [PremisesService],
  exports : [PremisesService]
})

export class PremisesModule {}
