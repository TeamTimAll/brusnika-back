import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../generic/service";

import { EventsEntity } from "./events.entity";
import { CreateEventsDto } from "./dtos/create-events.dto";
import { UpdateEventsDto } from "./dtos/update-events.dto";
import { FilterEventsDto } from "./dtos/events.dto";

@Injectable()
export class EventsService extends BasicService<
	EventsEntity,
	CreateEventsDto,
	UpdateEventsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("events", EventsEntity, dataSource);
	}

	async findAllWith(filter?: FilterEventsDto): Promise<any> {
		const currentDate = new Date();
		const queryBuilder = this.repository
			.createQueryBuilder("events")
			.leftJoinAndSelect("events.city", "city");

		if (filter) {
			if (filter.type) {
				queryBuilder.andWhere("events.type = :type", {
					type: filter.type,
				});
			}

			if (filter.city_id) {
				queryBuilder.andWhere("city.id = :city", {
					city: filter.city_id,
				});
			}

			if (filter.format) {
				queryBuilder.andWhere("events.format = :format", {
					format: filter.format,
				});
			}
		}

		const upcomingEvents = await queryBuilder
			.where("events.date > :currentDate", { currentDate })
			.getMany();

		const pastEvents = await queryBuilder
			.where("events.date < :currentDate", { currentDate })
			.getMany();

		return {
			upcoming: upcomingEvents,
			past: pastEvents,
		};
	}
}
