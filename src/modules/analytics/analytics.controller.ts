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
	LeadAnalyticsDto,
	MainAnalyticsDto,
	TopAnalyticsDto,
	UsersAnalyticsDto,
	UsersByCityAnalyticsDto,
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("top-news")
	@ApiOperation({ description: "Get news analytics" })
	getTopNews(@Query() payload: TopAnalyticsDto) {
		return this.analyticsService.getTopNewsByViews(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("top-trainings")
	@ApiOperation({ description: "Get trainings analytics" })
	getTopTrainings(@Query() payload: TopAnalyticsDto) {
		return this.analyticsService.getTopTrainings(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("top-events")
	@ApiOperation({ description: "Get events analytics" })
	getTopEvents(@Query() payload: TopAnalyticsDto) {
		return this.analyticsService.getTopEventsByViews(payload);
	}

	@Roles([
		RoleType.AGENT,
		RoleType.HEAD_OF_AGENCY,
		RoleType.ADMIN,
		RoleType.AFFILIATE_MANAGER,
		RoleType.MANAGER,
	])
	@Get("manager/time")
	@ApiOperation({ description: "Get manager time analytics" })
	getTopManagersByTime(
		@Query() payload: TopAnalyticsDto,
		@User() user: ICurrentUser,
	) {
		return this.analyticsService.managerStatisticsByTime(payload, user);
	}
	@Roles([
		RoleType.AGENT,
		RoleType.HEAD_OF_AGENCY,
		RoleType.ADMIN,
		RoleType.AFFILIATE_MANAGER,
		RoleType.MANAGER,
	])
	@Get("manager/price")
	@ApiOperation({ description: "Get manager price analytics" })
	getTopManagersByPrice(
		@Query() payload: TopAnalyticsDto,
		@User() user: ICurrentUser,
	) {
		return this.analyticsService.managerStatisticsByPrice(payload, user);
	}

	@Roles([
		RoleType.AGENT,
		RoleType.HEAD_OF_AGENCY,
		RoleType.ADMIN,
		RoleType.AFFILIATE_MANAGER,
		RoleType.MANAGER,
	])
	@Get("manager/count")
	@ApiOperation({ description: "Get manager count analytics" })
	getTopManagersByCount(
		@Query() payload: TopAnalyticsDto,
		@User() user: ICurrentUser,
	) {
		return this.analyticsService.managerStatisticsByCount(payload, user);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("users/city")
	@ApiOperation({ description: "Get users by city analytics" })
	getUsersByCity(@Query() payload: UsersByCityAnalyticsDto) {
		return this.analyticsService.getUsersByCity(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("users/date")
	@ApiOperation({ description: "Get users by date analytics" })
	getUsersByDate(@Query() payload: UsersAnalyticsDto) {
		return this.analyticsService.getUsersByDate(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("users/active")
	@ApiOperation({ description: "Get users by date analytics" })
	getUsersByActive(@Query() payload: UsersAnalyticsDto) {
		return this.analyticsService.getUsersByActivity(payload);
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

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("leads/by-status")
	@ApiOperation({ description: "Get leads analytics by status" })
	getLeadsByStatus(@Query() payload: MainAnalyticsDto) {
		return this.analyticsService.getLeadsByCurrentStatus(payload);
	}

	@Roles([RoleType.ADMIN, RoleType.AFFILIATE_MANAGER, RoleType.MANAGER])
	@Get("leads/count")
	@ApiOperation({ description: "Get leads analytics by status" })
	getLeadsCount(@Query() payload: LeadAnalyticsDto) {
		return this.analyticsService.getLeadsCountByStatus(payload);
	}
}
