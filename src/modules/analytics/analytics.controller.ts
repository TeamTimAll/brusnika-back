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
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { AnalyticsService } from "./analytics.service";
import {
	BaseAnalyticsDto,
	LeadAnalyticsDto,
	MainAnalyticsDto,
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

	@Get("top-news")
	@ApiOperation({ description: "Get news analytics" })
	getTopNews(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getTopNewsByViews(payload);
	}

	@Get("top-trainings")
	@ApiOperation({ description: "Get trainings analytics" })
	getTopTrainings(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getTopTrainings(payload);
	}

	@Get("top-events")
	@ApiOperation({ description: "Get events analytics" })
	getTopEvents(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getTopEventsByViews(payload);
	}

	@Get("manager/time") // chala
	@ApiOperation({ description: "Get manager time analytics" })
	getTopManagersByTime(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.managerStatisticsByTime(payload);
	}

	@Get("manager/price") // chala
	@ApiOperation({ description: "Get manager price analytics" })
	getTopManagersByPrice(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.managerStatisticsByPrice(payload);
	}

	@Get("manager/count") // chala
	@ApiOperation({ description: "Get manager count analytics" })
	getTopManagersByCount(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.managerStatisticsByCount(payload);
	}

	@Get("users/city")
	@ApiOperation({ description: "Get users by city analytics" })
	getUsersByCity(@Query() payload: UsersAnalyticsDto) {
		return this.analyticsService.getUsersByCity(payload);
	}

	@Get("users/date")
	@ApiOperation({ description: "Get users by date analytics" })
	getUsersByDate(@Query() payload: BaseAnalyticsDto) {
		return this.analyticsService.getUsersByDate(payload);
	}

	@Get("main")
	@ApiOperation({ description: "Get main analytics by date" })
	getMain(@Query() payload: MainAnalyticsDto) {
		return this.analyticsService.getMainAnalytics(payload);
	}

	@Get("leads/by-status")
	@ApiOperation({ description: "Get leads analytics by status" })
	getLeadsByStatus(@Query() payload: MainAnalyticsDto) {
		return this.analyticsService.getLeadsByCurrentStatus(
			payload.fromDate,
			payload.toDate,
		);
	}

	@Get("leads/count")
	@ApiOperation({ description: "Get leads analytics by status" })
	getLeadsCount(@Query() payload: LeadAnalyticsDto) {
		return this.analyticsService.getLeadsCountByStatus(payload);
	}
}
