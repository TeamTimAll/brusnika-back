import { Injectable } from "@nestjs/common";

import { BookingsService } from "../../bookings/bookings.service";

import { BookingDto } from "./dto";

@Injectable()
export class BookingQueueService {
	constructor(private readonly bookingService: BookingsService) {}

	async createOrUpdateBooking(booking: BookingDto) {
		const foundBooking = await this.bookingService.readOneByExtId(
			booking.booking_ext_id,
			{ id: true, agent: { id: true } },
		);

		return this.bookingService.update(foundBooking.id, {
			status: booking.status,
		});
	}
}
