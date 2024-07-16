import { Controller, Get, HttpStatus, Query, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { User } from "../../decorators";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { BaseDto } from "../../common/base/base_dto";

import { CalendarService } from "./calendar.service";
import { CalendarDto } from "./dto/calendar.dto";

@ApiTags("Calendar")
@Controller("/calendar")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CalendarController {
	constructor(private service: CalendarService) {}

	// ------------------------------@Get()-------------------------------------

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
	async getCalendar(
		@User() user: ICurrentUser,
		@Query() dto: CalendarDto,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.getCalendar(user, dto);
		return metaData;
	}
}
