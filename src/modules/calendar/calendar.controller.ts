import {
	Controller,
	Get,
	HttpStatus,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CalendarService } from "./calendar.service";
import { CalendarDto } from "./dto/calendar.dto";

@ApiTags("Calendar")
@Controller("/calendar")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class CalendarController {
	constructor(private service: CalendarService) {}

	@ApiQuery({
		name: "city_id",
		description: " city id",
		required: false,
	})
	@ApiOperation({ summary: "Get calendar" })
	@ApiResponse({
		status: HttpStatus.OK,
	})
	@Get()
	async getCalendar(@User() user: ICurrentUser, @Query() dto: CalendarDto) {
		return await this.service.getCalendar(user, dto);
	}
}
