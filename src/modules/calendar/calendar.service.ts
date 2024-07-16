import { Inject, Injectable } from "@nestjs/common";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { EventsEntity } from "modules/events/events.entity";
import { NewsEntity } from "modules/news/news.entity";

import { Weekdays, WeekdaysMap } from "../../common/enums/weekdays";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { VisitsEntity } from "../../modules/visits/visits.entity";
import { EventsService } from "../events/events.service";
import { NewsService } from "../news/news.service";
import { VisitsService } from "../visits/visits.service";

import { CalendarDto } from "./dto/calendar.dto";

@Injectable()
export class CalendarService {
	@Inject()
	private visitsService!: VisitsService;
	@Inject()
	private newsService!: NewsService;
	@Inject()
	private eventsService!: EventsService;

	async getCalendar(user: ICurrentUser, dto: CalendarDto) {
		let visitsQueryBuilder = this.visitsService.repository
			.createQueryBuilder("v")
			.select([
				"JSON_BUILD_OBJECT('id', p.id, 'name', p.name, 'location', p.location) AS project",
				"JSON_BUILD_OBJECT('id', c.id, 'fullname', c.fullname, 'phone_number', c.phone_number) AS client",
			])
			.leftJoin("projects", "p", "p.id = v.project_id")
			.leftJoin("clients", "c", "c.id = v.client_id")
			.where("v.agent_id = :agent_id", {
				agent_id: user.user_id,
			})
			.orderBy("v.date", "ASC");
		let newsQueryBuilder = this.newsService.repository
			.createQueryBuilder("n")
			.select()
			.orderBy("n.published_at", "ASC");
		let eventsQueryBuilder = this.eventsService.repository
			.createQueryBuilder("e")
			.select()
			.orderBy("e.date", "ASC");

		if (dto.date && dto.weekday) {
			const weekday = WeekdaysMap.get(dto.weekday) ?? Weekdays.Monday;
			visitsQueryBuilder = this.cutByWeekdayRange(
				visitsQueryBuilder,
				"v.date",
				dto.date,
				weekday,
			);
			newsQueryBuilder = this.cutByWeekdayRange(
				newsQueryBuilder,
				"n.published_at",
				dto.date,
				weekday,
			);
			eventsQueryBuilder = this.cutByWeekdayRange(
				eventsQueryBuilder,
				"e.date",
				dto.date,
				weekday,
			);
		}

		const visits = await visitsQueryBuilder.getRawMany<VisitsEntity>();
		const news = await newsQueryBuilder.getRawMany<NewsEntity>();
		const events = await eventsQueryBuilder.getRawMany<EventsEntity>();

		// This comes from CRM system.
		const visitsWithManager = visits.map((v, i) => {
			v["manager"] = {
				id: i + 1,
				fullname: "manager_name",
				phone: "+99899" + Math.floor(Math.random() * 1000 * 1000 * 10),
			};
			return v;
		});

		return { visits: visitsWithManager, news, events };
	}

	// example for property: "e.date"
	cutByWeekdayRange<T extends ObjectLiteral>(
		qb: SelectQueryBuilder<T>,
		property: string,
		date: string,
		weekday: Weekdays,
	) {
		return qb
			.where(
				property +
					" >= CAST(:date AS date) - (EXTRACT(isodow FROM CAST(:date AS date)) - :weekday) * INTERVAL '1 day'",
				{
					date: date,
					weekday: weekday,
				},
			)
			.andWhere(
				property +
					" <= CAST(:date AS date) - (EXTRACT(isodow FROM CAST(:date AS date)) - :weekday) * INTERVAL '1 day'",
				{
					date: date,
					weekday: weekday + 7,
				},
			);
	}
}
