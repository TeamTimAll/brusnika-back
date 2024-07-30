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
	UseInterceptors,
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

import { RoleType } from "../../constants";
import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../../modules/auth/guards/jwt.guard";

import { CreateEventsMetaDataDto } from "./dtos/create-events.dto";
import { EventsDto, FilterEventsDto } from "./dtos/events.dto";
import {
	AcceptInvitionMetaDataDto,
	DeleteUserInvitationMetaDataDto,
	InviteUsersMetaDataDto,
	JoinToEventMetaDataDto,
} from "./dtos/invite-users.dto";
import { LikeEventMetaDataDto } from "./dtos/like-event.dto";
import { UpdateEventsMetaDataDto } from "./dtos/update-events.dto";
import { EventsService } from "./events.service";

@ApiTags("events")
@Controller("/events")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class EventsController {
	constructor(private eventsService: EventsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async createEvents(
		@Body() dto: CreateEventsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.create(dto.data, user);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async readAll(@Query() dto: FilterEventsDto, @User() user: ICurrentUser) {
		return await this.eventsService.readAll(dto, user);
	}

	@Get("user-events")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async userEvents(@User() user: ICurrentUser) {
		return await this.eventsService.userEvents(user);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async getSingleEvents(@Param("id") id: number, @User() user: ICurrentUser) {
		return await this.eventsService.readOne(id, user);
	}

	@Post("toggle-like")
	@ApiOperation({ summary: "toggle like events" })
	async toggleLike(
		@Body() dto: LikeEventMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.toggleLike(dto.data, user);
	}

	@Post("invite-users")
	@ApiOperation({ summary: "invite users" })
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async inviteUsers(@Body() dto: InviteUsersMetaDataDto) {
		return await this.eventsService.inviteUsers(dto.data);
	}

	@Post("join-to-event")
	@ApiOperation({ summary: "join to event" })
	async joinToEvent(
		@Body() dto: JoinToEventMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.joinToEvent(dto.data.id, user);
	}

	@Post("delete-user-invitation")
	@ApiOperation({ summary: "delete user invitation" })
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async deleteUserInvitation(@Body() dto: DeleteUserInvitationMetaDataDto) {
		return await this.eventsService.deleteUserInvitation(dto.data.id);
	}

	@Post("accept-invitation")
	@ApiOperation({ summary: "accept invitation" })
	async acceptInvitation(
		@Body() dto: AcceptInvitionMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.acceptInvitation(dto.data, user);
	}

	@Put(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async updateEvents(
		@Param("id") id: number,
		@Body() dto: UpdateEventsMetaDataDto,
	) {
		return await this.eventsService.update(id, dto.data);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	async deleteEvents(@Param("id") id: number) {
		return await this.eventsService.remove(id);
	}
}
