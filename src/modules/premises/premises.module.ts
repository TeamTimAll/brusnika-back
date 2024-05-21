import { Module } from '@nestjs/common';
import { PremisesService } from './premises.service';

@Module({
  providers: [PremisesService]
})
export class PremisesModule {}
