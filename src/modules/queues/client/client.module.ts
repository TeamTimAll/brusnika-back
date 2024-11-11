import { forwardRef, Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";

import { ClientQueueService } from "./client.service";
import { ClientQueueController } from "./client.controller";

@Module({
	imports: [forwardRef(() => ClientModule), UserModule, QueueModule],
	controllers: [ClientQueueController],
	providers: [ClientQueueService],
	exports: [ClientQueueService],
})
export class ClientQueueModule {}
