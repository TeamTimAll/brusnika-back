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

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
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
import { EventInvitationEntity } from "./entities/event-invition.entity";
import { EventsEntity } from "./events.entity";
import { EventLikedResponse, EventsService } from "./events.service";

@ApiTags("events")
@Controller("/events")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
	constructor(private eventsService: EventsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async createEvents(@Body() createEventsDto: CreateEventsDto) {
		const metaData = BaseDto.createFromDto(new BaseDto<EventsEntity>());
		const response =
			await this.eventsService.createWithContacts(createEventsDto);
		metaData.data = response;
		return metaData;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async readAll(@Query() dto: FilterEventsDto, @User() user: ICurrentUser) {
		const metaData = BaseDto.createFromDto(new BaseDto<EventsEntity[]>());
		const response = await this.eventsService.readAll(dto, user);
		metaData.setLinks(response.links);
		metaData.data = response.data;
		return metaData;
	}

	@Get("user-events")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async userEvents(@User() user: ICurrentUser) {
		const metaData = BaseDto.createFromDto(new BaseDto<EventsEntity[]>());
		const response = await this.eventsService.userEvents(user);
		metaData.data = response;
		return metaData;
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async getSingleEvents(@Param("id") id: number, @User() user: ICurrentUser) {
		const metaData = BaseDto.createFromDto(new BaseDto<EventsEntity>());
		const response = await this.eventsService.readOne(id, user);
		metaData.data = response;
		return metaData;
	}

	@Post("toggle-like")
	@ApiOperation({ summary: "toggle like events" })
	async toggleLike(@Body() body: LikeEventDto, @User() user: ICurrentUser) {
		const metaData = BaseDto.createFromDto(
			new BaseDto<EventLikedResponse>(),
		);
		const response = await this.eventsService.toggleLike(body, user);
		metaData.data = response;
		return metaData;
	}

	@Post("invite-users")
	@ApiOperation({ summary: "invite users" })
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async inviteUsers(@Body() body: InviteUsersDto) {
		const metaData = BaseDto.createFromDto(
			new BaseDto<EventInvitationEntity[]>(),
		);
		const response = await this.eventsService.inviteUsers(body);
		metaData.data = response;
		return metaData;
	}

	@Post("join-to-event")
	@ApiOperation({ summary: "join to event" })
	async joinToEvent(
		@Body() body: JoinToEventDto,
		@User() user: ICurrentUser,
	) {
		const metaData = BaseDto.createFromDto(
			new BaseDto<EventInvitationEntity>(),
		);
		const response = await this.eventsService.joinToEvent(body.id, user);
		metaData.data = response;
		return metaData;
	}

	@Post("delete-user-invitation")
	@ApiOperation({ summary: "delete user invitation" })
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async deleteUserInvitation(@Body() body: DeleteUserInvitationDto) {
		const metaData = BaseDto.createFromDto(
			new BaseDto<EventInvitationEntity>(),
		);
		const response = await this.eventsService.deleteUserInvitation(body.id);
		metaData.data = response;
		return metaData;
	}

	@Post("accept-invitation")
	@ApiOperation({ summary: "accept invitation" })
	async acceptInvitation(
		@Body() body: AcceptInvitionDto,
		@User() user: ICurrentUser,
	) {
		const metaData = BaseDto.createFromDto(
			new BaseDto<EventInvitationEntity>(),
		);
		const response = await this.eventsService.acceptInvitation(body, user);
		metaData.data = response;
		return metaData;
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async updateEvents(
		@Param("id") id: number,
		@Body() updateEventsDto: UpdateEventsDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto<EventsEntity>());
		const response = await this.eventsService.updateWithContacts(
			id,
			updateEventsDto,
		);
		metaData.data = response;
		return metaData;
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async deleteEvents(@Param("id") id: number) {
		const metaData = BaseDto.createFromDto(new BaseDto<EventsEntity>());
		const response = await this.eventsService.remove(id);
		metaData.data = response;
		return metaData;
	}
}
