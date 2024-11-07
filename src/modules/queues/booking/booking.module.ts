import { Module } from "@nestjs/common";

import { BookingsModule } from "../../bookings/bookings.module";

import { BookingQueueService } from "./booking.service";
import { BookingQueueController } from "./booking.controller";

@Module({
	imports: [BookingsModule],
	controllers: [BookingQueueController],
	providers: [BookingQueueService],
})
export class BookingQueueModule {}
