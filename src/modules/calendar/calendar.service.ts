import { Inject, Injectable } from "@nestjs/common";

// import { BookingsService } from "../bookings/bookings.service";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { EventsService } from "../events/events.service";
import { NewsService } from "../news/news.service";
import { VisitsService } from "../visits/visits.service";

@Injectable()
export class CalendarService {
	// @Inject()
	// private bookingsService!: BookingsService;
	@Inject()
	private visitsService!: VisitsService;
	@Inject()
	private newsService!: NewsService;
	@Inject()
	private eventsService!: EventsService;

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
					phone_number: true,
				},
			},
			relations: { project: true, client: true },
			where: { agent_id: user.user_id },
		});

		const news = await this.newsService.r_findAll();
		const events = await this.eventsService.findAll();

		// This comes from CRM system.
		const visitsWithManager = visits.map((v, i) => {
			v["manager"] = {
				id: i + 1,
				fullname: "manager_name",
				phone: "+99899" + Math.floor(Math.random() * 1000 * 1000 * 10),
			};
			return v;
		});

		return { /*bookings,*/ visits: visitsWithManager, news, events };
	}
}
