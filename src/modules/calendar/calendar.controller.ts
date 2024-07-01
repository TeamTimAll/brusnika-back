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
		@Query("city_id") _city_id: string,
	) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.service.getCalendar(user);
		return metaData;
	}
}
