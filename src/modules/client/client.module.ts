import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { ClientStatusModule } from '../../modules/client-status/client-status.module';


@Module({
  imports : [
    ClientStatusModule,
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  exports : [ ClientService ],
  controllers: [ClientController],
  providers: [ClientService],

})

export class ClientModule {}


/*
  What should be changed  | added 
  1 : Sending request to BpmSoft 
  2 : Assign clients to agents ( logic should be discussed)
  3 : Getting client info ( such as pinning type from CRM  BRUSTSNIKA ) should be added
*/

