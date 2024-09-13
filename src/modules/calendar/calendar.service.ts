import { Inject, Injectable } from "@nestjs/common";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { EventsEntity } from "modules/events/events.entity";

import { Weekdays, WeekdaysMap } from "../../common/enums/weekdays";
import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { VisitsEntity } from "../../modules/visits/visits.entity";
import { EventInvitationEntity } from "../events/entities/event-invition.entity";
import { EventsService } from "../events/events.service";
import { VisitsService } from "../visits/visits.service";

import { CalendarDto } from "./dto/Calendar.dto";

@Injectable()
export class CalendarService {
	@Inject()
	private visitsService!: VisitsService;
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
		let eventsQueryBuilder = this.eventsService.repository
			.createQueryBuilder("e")
			.select([
				"e.id as id",
				"e.title as title",
				"e.description as description",
				"e.photo as photo",
				"e.location as location",
				"e.date as date",
				"to_char(e.start_time, 'HH24:MI') as start_time",
				"to_char(e.end_time, 'HH24:MI') as end_time",
				"e.leader as leader",
				"e.max_visitors as max_visitors",
				"e.phone as phone",
				"e.format as format",
				"e.type as type",
				"e.city_id as city_id",
				"e.is_banner as is_banner",
				"(CASE WHEN create_by_id = :create_by_id THEN TRUE ELSE FALSE END) as is_owner",
				"CASE WHEN iu.id IS NOT NULL THEN JSON_BUILD_OBJECT('is_accepted',iu.is_accepted,'id',iu.id) ELSE '{}' END as user_invitation",
			])
			.leftJoin(
				(qb: SelectQueryBuilder<EventInvitationEntity>) => {
					return qb
						.select()
						.from(EventInvitationEntity, "ei")
						.where("ei.user_id = :create_by_id");
				},
				"iu",
				"iu.event_id = e.id",
			)
			.where(
				"e.id IN (SELECT ei.event_id FROM event_invitation ei WHERE ei.user_id = :user_id AND ei.is_accepted IS NOT FALSE)",
				{
					user_id: user.user_id,
				},
			)
			.orWhere("e.create_by_id = :create_by_id", {
				create_by_id: user.user_id,
			})
			.orderBy("e.date", "ASC");

		if (dto.date && dto.weekday) {
			const weekday = WeekdaysMap.get(dto.weekday) ?? Weekdays.Monday;
			visitsQueryBuilder = this.cutByWeekdayRange(
				visitsQueryBuilder,
				"v.date",
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
		if (dto.monthly_date) {
			visitsQueryBuilder = this.cutByMonthlyRange(
				visitsQueryBuilder,
				"v.date",
				dto.monthly_date,
			);
			eventsQueryBuilder = this.cutByMonthlyRange(
				eventsQueryBuilder,
				"e.date",
				dto.monthly_date,
			);
		}

		if (!dto.is_draft || user.role !== RoleType.ADMIN) {
			eventsQueryBuilder = eventsQueryBuilder.andWhere(
				"e.is_draft IS FALSE",
			);
		}

		const visits = await visitsQueryBuilder.getRawMany<VisitsEntity>();
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

		return { visits: visitsWithManager, events };
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

	cutByMonthlyRange<T extends ObjectLiteral>(
		qb: SelectQueryBuilder<T>,
		property: string,
		date: string,
	) {
		return qb
			.andWhere(
				`${property} >= DATE_TRUNC('month', CAST(:date AS date))`,
				{
					date: date,
				},
			)
			.andWhere(
				`${property} <= DATE_TRUNC('month', CAST(:date AS date)) + INTERVAL '1 month' - INTERVAL '1 millisecond'`,
				{ date: date },
			);
	}
}
