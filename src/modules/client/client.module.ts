import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";
import { ClientQueueModule } from "../queues/clients_queue/client_queue.module";

import { ClientController } from "./client.controller";
import { ClientEntity } from "./client.entity";
import { ClientService } from "./client.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([ClientEntity]),
		UserModule,
		ClientQueueModule,
	],
	controllers: [ClientController],
	providers: [ClientService],
	exports: [ClientService],
})
export class ClientModule {}

/*
  What should be changed  | added
  1 : Sending request to BpmSoft
  2 : Assign clients to agents ( logic should be discussed)
  3 : Getting client info ( such as pinning type from CRM  BRUSTSNIKA ) should be added
*/
