import {
	Controller,
	Get,
	Inject,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RoleType } from "../../constants";

import { AnalyticsService } from "./analytics.service";
import {
	BaseAnalyticsDto,
	LeadAnalyticsDto,
	MainAnalyticsDto,
	ManagerAnalyticsDto,
	UsersAnalyticsDto,
} from "./dtos";

@ApiTags("Analytics")
@Controller("analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class AnalyticsController {
	constructor(
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@Get("me")
	@ApiOperation({ description: "Get own analytics" })
	readOne(@User() user: ICurrentUser) {
		return this.analyticsService.createOrFind(user.user_id);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("top-news")
	@ApiOperation({ description: "Get news analytics" })
	getTopNews(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getTopNewsByViews(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("top-trainings")
	@ApiOperation({ description: "Get trainings analytics" })
	getTopTrainings(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getTopTrainings(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("top-events")
	@ApiOperation({ description: "Get events analytics" })
	getTopEvents(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getTopEventsByViews(payload);
	}

	@Roles([RoleType.AGENT, RoleType.HEAD_OF_AGENCY])
	@Get("manager/time")
	@ApiOperation({ description: "Get manager time analytics" })
	getTopManagersByTime(
		@Query() payload: ManagerAnalyticsDto,
		@User() user: ICurrentUser,
	) {
		return this.analyticsService.managerStatisticsByTime(payload, user);
	}
	@Roles([RoleType.AGENT, RoleType.HEAD_OF_AGENCY])
	@Get("manager/price")
	@ApiOperation({ description: "Get manager price analytics" })
	getTopManagersByPrice(
		@Query() payload: ManagerAnalyticsDto,
		@User() user: ICurrentUser,
	) {
		return this.analyticsService.managerStatisticsByPrice(payload, user);
	}

	@Roles([RoleType.AGENT, RoleType.HEAD_OF_AGENCY])
	@Get("manager/count")
	@ApiOperation({ description: "Get manager count analytics" })
	getTopManagersByCount(
		@Query() payload: ManagerAnalyticsDto,
		@User() user: ICurrentUser,
	) {
		return this.analyticsService.managerStatisticsByCount(payload, user);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("users/city")
	@ApiOperation({ description: "Get users by city analytics" })
	getUsersByCity(@Query() payload: UsersAnalyticsDto) {
		return this.analyticsService.getUsersByCity(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("users/date")
	@ApiOperation({ description: "Get users by date analytics" })
	getUsersByDate(@Query() payload: UsersAnalyticsDto) {
		return this.analyticsService.getUsersByDate(payload);
	}

	@Roles([
		RoleType.AGENT,
		RoleType.ADMIN,
		RoleType.AFFILIATE_MANAGER,
		RoleType.HEAD_OF_AGENCY,
	])
	@Get("main")
	@ApiOperation({ description: "Get main analytics by date" })
	getMain(@Query() payload: MainAnalyticsDto, @User() user: ICurrentUser) {
		return this.analyticsService.getMainAnalytics(payload, user);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("leads/by-status")
	@ApiOperation({ description: "Get leads analytics by status" })
	getLeadsByStatus(@Query() payload: MainAnalyticsDto) {
		return this.analyticsService.getLeadsByCurrentStatus(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER])
	@Get("leads/count")
	@ApiOperation({ description: "Get leads analytics by status" })
	getLeadsCount(@Query() payload: LeadAnalyticsDto) {
		return this.analyticsService.getLeadsCountByStatus(payload);
	}
}
