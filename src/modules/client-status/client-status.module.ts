import { Module } from '@nestjs/common';
import { ClientStatusController } from './client-status.controller';
import { ClientStatusService } from './client-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientStatusEntity } from './client-status.entity';

@Module({

  imports : [ TypeOrmModule.forFeature([ClientStatusEntity])],
  exports : [ClientStatusService],
  controllers: [ClientStatusController],
  providers: [ClientStatusService]
  
})

export class ClientStatusModule {}
