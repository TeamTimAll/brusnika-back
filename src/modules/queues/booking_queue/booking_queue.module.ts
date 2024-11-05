import { Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { PremisesModule } from "../../premises/premises.module";
import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";

import { BookingQueueService } from "./booking_queue.service";

@Module({
	imports: [QueueModule, UserModule, ClientModule, PremisesModule],
	providers: [BookingQueueService],
	exports: [BookingQueueService],
})
export class BookingQueueModule {}
