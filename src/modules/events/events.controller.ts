import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Put,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { UUIDParam, User } from "../../decorators";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { EventsDto } from "./dtos/events.dto";
import { UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsService } from "./events.service";

@Controller("/events")
@ApiTags("events")
export class EventsController {
	constructor(private eventsService: EventsService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	@Post()
	async createEvents(
		@Body() createEventsDto: CreateEventsDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.create(createEventsDto, user);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async getSingleEvents(@UUIDParam("id") id: string): Promise<any> {
		return await this.eventsService.findOne(id);
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateEvents(
		@UUIDParam("id") id: string,
		@Body() updateEventsDto: UpdateEventsDto,
	): Promise<any> {
		return this.eventsService.update(id, updateEventsDto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async deleteEvents(@UUIDParam("id") id: string): Promise<any> {
		return await this.eventsService.remove(id);
	}
}
