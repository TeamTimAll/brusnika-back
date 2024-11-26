import { forwardRef, Module } from "@nestjs/common";

import { BookingsModule } from "../../bookings/bookings.module";
import { PremisesModule } from "../../premises/premises.module";
import { ClientModule } from "../../client/client.module";
import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";
import { LeadsModule } from "../../leads/leads.module";

import { BookingQueueService } from "./booking.service";
import { BookingQueueController } from "./booking.controller";

@Module({
	imports: [
		forwardRef(() => BookingsModule),
		UserModule,
		ClientModule,
		PremisesModule,
		QueueModule,
		LeadsModule,
	],
	controllers: [BookingQueueController],
	providers: [BookingQueueService],
	exports: [BookingQueueService],
})
export class BookingQueueModule {}
