import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiTags,
} from "@nestjs/swagger";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { EventsDto, FilterEventsDto } from "./dtos/events.dto";
import { UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsService } from "./events.service";

@Controller("/events")
@ApiTags("events")
export class EventsController {
	constructor(private eventsService: EventsService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	@Post()
	createEvents(@Body() createEventsDto: CreateEventsDto) {
		return this.eventsService.createWithContacts(createEventsDto);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	getSingleEvents(@Param("id") id: number) {
		return this.eventsService.readOne(id);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	readAll(@Query() dto: FilterEventsDto) {
		return this.eventsService.readAll(dto);
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	updateEvents(
		@Param("id") id: number,
		@Body() updateEventsDto: UpdateEventsDto,
	) {
		return this.eventsService.updateWithContacts(id, updateEventsDto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	deleteEvents(@Param("id") id: number) {
		return this.eventsService.remove(id);
	}
}
