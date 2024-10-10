import { Module } from "@nestjs/common";

import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";

import { ClinetQueueService } from "./client_queue.service";

@Module({
	imports: [QueueModule, UserModule],
	providers: [ClinetQueueService],
	exports: [ClinetQueueService],
})
export class ClientQueueModule {}
