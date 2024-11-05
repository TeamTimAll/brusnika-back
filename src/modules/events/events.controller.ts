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
import { ApiErrorResponse, User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../../modules/auth/guards/jwt.guard";

import { AcceptInvitionMetaDataDto } from "./dtos/AcceptInvition.dto";
import { BannerFilterDto } from "./dtos/BannerFilter.dto";
import { CreateEventsMetaDataDto } from "./dtos/CreateEvents.dto";
import { DeleteUserInvitationMetaDataDto } from "./dtos/DeleteUserInvitation.dto";
import { EventSearchDto } from "./dtos/EventSearch.dto";
import { EventsDto, FilterEventsDto } from "./dtos/FilterEvents.dto";
import { InviteUsersMetaDataDto } from "./dtos/InviteUsers.dto";
import { JoinToEventMetaDataDto } from "./dtos/JoinToEvent.dto";
import { LeaveInvitionMetaDataDto } from "./dtos/LeaveInvition.dto";
import { RecommendedEventDto } from "./dtos/RecommendedEvent.dto";
import { ToggleEventMetaDataDto } from "./dtos/ToggleEvent.dto";
import { UpdateEventsMetaDataDto } from "./dtos/UpdateEvents.dto";
import { EventInvitationNotFoundError } from "./errors/EventInvitionNotFound.error";
import { EventsService } from "./events.service";

@ApiTags("events")
@Controller("/events")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class EventsController {
	constructor(private eventsService: EventsService) {}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiCreatedResponse({ type: EventsDto })
	async createEvents(
		@Body() dto: CreateEventsMetaDataDto,
		@User() user: ICurrentUser,
	) {
		const res = await this.eventsService.create(dto.data, user);
		return res;
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

	@Get("banner")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async banner(@User() user: ICurrentUser, @Query() dto: BannerFilterDto) {
		return await this.eventsService.banner(dto, user);
	}

	@Get("recommend")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async recommend(
		@User() user: ICurrentUser,
		@Query() dto: RecommendedEventDto,
	) {
		return await this.eventsService.recommend(dto, user);
	}

	@Get("search")
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: EventsDto })
	async search(@Query() dto: EventSearchDto) {
		return await this.eventsService.search(dto);
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
		@Body() dto: ToggleEventMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.toggleLike(dto.data, user);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post("toggle-draft")
	@ApiOperation({ summary: "toggle draft events" })
	async toggleDraft(@Body() dto: ToggleEventMetaDataDto) {
		return await this.eventsService.toggleDraft(dto.data);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post("invite-users")
	@ApiOperation({ summary: "invite users" })
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Post("delete-user-invitation")
	@ApiOperation({ summary: "delete user invitation" })
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

	@Post("leave")
	@ApiOperation({ summary: "leave from event" })
	@ApiErrorResponse(EventInvitationNotFoundError, "event_id: 0, user_id: 0")
	async leaveFromEvent(
		@Body() dto: LeaveInvitionMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.eventsService.leaveFromEvent(dto.data, user);
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Delete(":id")
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiAcceptedResponse()
	async deleteEvents(@Param("id") id: number) {
		return await this.eventsService.delete(id);
	}
}
