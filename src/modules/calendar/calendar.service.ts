import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

// import { BookingsService } from "../bookings/bookings.service";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { VisitsService } from "../visits/visits.service";

@Injectable()
export class CalendarService {
	// @Inject()
	// private bookingsService!: BookingsService;
	@Inject()
	private visitsService!: VisitsService;

	async getCalendar(user: ICurrentUser) {
		// const bookings = await this.bookingsService.new_findAll(user);
		const visits = await this.visitsService.repository.find({
			select: {
				project: {
					id: true,
					name: true,
					location: true,
				},
				client: {
					id: true,
					fullname: true,
				},
			},
			relations: { project: true, client: true },
			where: { agent_id: user.user_id },
		});

		// This comes from CRM system.
		const visitsWithManager = visits.map((v) => {
			v["manager"] = {
				id: uuid(),
				fullname: "manager_name",
				phone: "+99899" + Math.floor(Math.random() * 1000 * 1000 * 10),
			};
			return v;
		});

		return { /*bookings,*/ visits: visitsWithManager };
	}
}
