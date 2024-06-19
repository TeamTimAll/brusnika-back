import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiCreatedResponse,
	ApiTags,
} from "@nestjs/swagger";

import { Uuid } from "boilerplate.polyfill";
import { ICurrentUser } from "interfaces/current-user.interface";

import { UUIDParam, User } from "../../decorators";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { EventsDto, FilterEventsDto } from "./dtos/events.dto";
import { UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsService } from "./events.service";

@Controller("/events")
@ApiTags("events")
export class EventsController {
	constructor(private service: EventsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getAllEvents(@Query() queryParams: FilterEventsDto): Promise<any> {
		return this.service.findAllWith(queryParams);
	}

	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	@Post()
	async createEvents(
		@Body() createEventsDto: CreateEventsDto,
		@User() user: ICurrentUser,
	) {
		return this.service.create(createEventsDto, user);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async getSingleEvents(@UUIDParam("id") id: Uuid): Promise<any> {
		return this.service.findOne(id);
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateEvents(
		@UUIDParam("id") id: Uuid,
		@Body() updateEventsDto: UpdateEventsDto,
	): Promise<any> {
		return this.service.update(id, updateEventsDto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async deleteEvents(@UUIDParam("id") id: Uuid): Promise<void> {
		await this.service.remove(id);
	}
}
