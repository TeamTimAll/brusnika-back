import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";

import {
	RussianWeekdaysString
} from "../../../common/enums/weekdays";

export class CalendarDto {
	@ApiProperty({
		enum: RussianWeekdaysString,
		default: RussianWeekdaysString.Monday,
		required: false,
	})
	@IsEnum(RussianWeekdaysString)
	@IsOptional()
	weekday = RussianWeekdaysString.Monday;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	date?: string;

	@ApiProperty({ required: false })
	@IsInt()
	@IsOptional()
	city_id?: number;
}
