import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsEntity } from './deals.entity';
import { ClientModule } from "../client/client.module"

@Module({
  imports : [ 
    ClientModule,
    TypeOrmModule.forFeature([ DealsEntity ])
  ],
  controllers: [DealsController],
  providers: [DealsService]
})

export class DealsModule {}
