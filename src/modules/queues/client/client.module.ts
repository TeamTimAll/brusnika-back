import { Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { UserModule } from "../../user/user.module";

import { ClientQueueService } from "./client.service";
import { ClientQueueController } from "./client.controller";

@Module({
	imports: [ClientModule, UserModule],
	controllers: [ClientQueueController],
	providers: [ClientQueueService],
})
export class ClientQueueModule {}
