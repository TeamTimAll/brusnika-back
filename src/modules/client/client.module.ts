import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { ClientStatusModule } from '../../modules/client-status/client-status.module';


@Module({
  imports : [
    ClientStatusModule,
    TypeOrmModule.forFeature([ClientEntity]) ,

    ],
  controllers: [ClientController],
  providers: [ClientService]

})

export class ClientModule {}
