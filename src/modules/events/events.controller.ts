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
	UseGuards,
} from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { User } from "../../decorators";
import { JwtAuthGuard } from "../../modules/auth/guards/jwt.guard";

import { CreateEventsDto } from "./dtos/create-events.dto";
import { EventsDto, FilterEventsDto } from "./dtos/events.dto";
import {
	AcceptInvitionDto,
	DeleteUserInvitationDto,
	InviteUsersDto,
	JoinToEventDto,
} from "./dtos/invite-users.dto";
import { LikeEventDto } from "./dtos/like-event.dto";
import { UpdateEventsDto } from "./dtos/update-events.dto";
import { EventsService } from "./events.service";

@ApiTags("events")
@Controller("/events")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EventsController {
	constructor(private eventsService: EventsService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	@Post()
	createEvents(@Body() createEventsDto: CreateEventsDto) {
		return this.eventsService.createWithContacts(createEventsDto);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	readAll(@Query() dto: FilterEventsDto, @User() user: ICurrentUser) {
		return this.eventsService.readAll(dto, user);
	}

	@Get("user-events")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	userEvents(@User() user: ICurrentUser) {
		return this.eventsService.userEvents(user);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	getSingleEvents(@Param("id") id: number, @User() user: ICurrentUser) {
		return this.eventsService.readOne(id, user);
	}

	@Post("toggle-like")
	@ApiOperation({ summary: "toggle like events" })
	toggleLike(@Body() body: LikeEventDto, @User() user: ICurrentUser) {
		return this.eventsService.toggleLike(body, user);
	}

	@Post("invite-users")
	@ApiOperation({ summary: "invite users" })
	inviteUsers(@Body() body: InviteUsersDto) {
		return this.eventsService.inviteUsers(body.id, body.user_ids);
	}

	@Post("join-to-event")
	@ApiOperation({ summary: "join to event" })
	joinToEvent(@Body() body: JoinToEventDto, @User() user: ICurrentUser) {
		return this.eventsService.joinToEvent(body.id, user);
	}

	@Post("delete-user-invitation")
	@ApiOperation({ summary: "delete user invitation" })
	deleteUserInvitation(@Body() body: DeleteUserInvitationDto) {
		return this.eventsService.deleteUserInvitation(body.id);
	}

	@Post("accept-invitation")
	@ApiOperation({ summary: "accept invitation" })
	acceptInvitation(
		@Body() body: AcceptInvitionDto,
		@User() user: ICurrentUser,
	) {
		return this.eventsService.acceptInvitation(body, user);
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
