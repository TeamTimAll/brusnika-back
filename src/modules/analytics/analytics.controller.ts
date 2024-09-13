import {
	Controller,
	Get,
	Inject,
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
}
