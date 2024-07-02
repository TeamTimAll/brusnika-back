import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../generic/service";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { type UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsEntity } from "./events.entity";

@Injectable()
export class EventsService extends BasicService<
	EventsEntity,
	CreateEventsDto,
	UpdateEventsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("events", EventsEntity, dataSource);
	}
}
