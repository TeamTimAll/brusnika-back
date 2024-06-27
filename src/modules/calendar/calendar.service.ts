import { Inject, Injectable } from "@nestjs/common";

import { BookingsService } from "../bookings/bookings.service";
import { VisitsService } from "../visits/visits.service";
import { ICurrentUser } from "../../interfaces/current-user.interface";

@Injectable()
export class CalendarService {
	@Inject()
	private bookingsService!: BookingsService;
	@Inject()
	private visitsService!: VisitsService;

	async getCalendar(user: ICurrentUser) {
		const bookings = await this.bookingsService.new_findAll(user);
		const visits = await this.visitsService.new_findAll(user);

		return { bookings, visits };
	}
}
