import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
} from "class-validator";
import { Transform } from "class-transformer";

import { RussianWeekdaysString } from "../../../common/enums/weekdays";

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
	@IsDateString()
	@IsOptional()
	monthly_date?: string;

	@ApiProperty({ required: false })
	@IsInt()
	@IsOptional()
	city_id?: number;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_draft?: boolean;
}
