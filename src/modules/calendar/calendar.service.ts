import { Inject, Injectable } from "@nestjs/common";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { EventsEntity } from "modules/events/events.entity";
import { NewsEntity } from "modules/news/news.entity";

import { Weekdays, WeekdaysMap } from "../../common/enums/weekdays";
import { RoleType } from "../../constants";
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
				"v.id AS id",
				"JSON_BUILD_OBJECT('id', p.id, 'name', p.name, 'location', p.location, 'photo', p.photo) AS project",
				"JSON_BUILD_OBJECT('id', c.id, 'fullname', c.fullname, 'phone_number', c.phone_number) AS client",
				"v.date AS date",
				"v.time AS time",
				"v.note AS note",
				"v.status AS status",
			])
			.leftJoin("projects", "p", "p.id = v.project_id")
			.leftJoin("clients", "c", "c.id = v.client_id")
			.where("v.agent_id = :agent_id", {
				agent_id: user.user_id,
			})
			.orderBy("v.date", "ASC");
		let newsQueryBuilder = this.newsService.repository
			.createQueryBuilder("n")
			.select([
				"n.id as id",
				"n.user_id as user_id",
				"n.title as title",
				"n.content as content",
				"n.cover_image as cover_image",
				"n.is_like_enabled as is_like_enabled",
				"n.is_extra_like_enabled as is_extra_like_enabled",
				"n.extra_like_icon as extra_like_icon",
				"n.published_at as published_at",
				"n.primary_category_id as primary_category_id",
				"n.second_category_id as second_category_id",
			])
			.orderBy("n.published_at", "ASC");
		let eventsQueryBuilder = this.eventsService.repository
			.createQueryBuilder("e")
			.select([
				"e.id as id",
				"e.title as title",
				"e.description as description",
				"e.photo as photo",
				"e.location as location",
				"e.date as date",
				"e.start_time as start_time",
				"e.end_time as end_time",
				"e.leader as leader",
				"e.max_visitors as max_visitors",
				"e.phone as phone",
				"e.format as format",
				"e.type as type",
				"e.city_id as city_id",
				"e.is_banner as is_banner",
			])
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

		if (!dto.is_draft || user.role !== RoleType.ADMIN) {
			eventsQueryBuilder = eventsQueryBuilder.andWhere(
				"e.is_draft IS FALSE",
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
			.andWhere(
				property +
					" >= CAST(:date AS date) - (EXTRACT(isodow FROM CAST(:date AS date)) - :weekday_start) * INTERVAL '1 day'",
				{
					date: date,
					weekday_start: weekday,
				},
			)
			.andWhere(
				property +
					" < CAST(:date AS date) - (EXTRACT(isodow FROM CAST(:date AS date)) - :weekday_end) * INTERVAL '1 day'",
				{
					date: date,
					weekday_end: weekday + 7,
				},
			);
	}
}
