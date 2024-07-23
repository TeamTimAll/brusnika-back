import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { EVENT_FORMAT, EVENT_TYPES } from "../events.entity";

export class EventsDto extends BaseDto {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	info?: string;
}

export class FilterEventsDto {
	@ApiProperty({
		required: false,
		type: "enum",
		enum: EVENT_FORMAT,
		description: "Event format",
	})
	@IsEnum(() => EVENT_FORMAT)
	@IsOptional()
	format?: EVENT_FORMAT;

	@ApiProperty({
		required: false,
		description: "City id",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;

	@ApiProperty({
		type: "enum",
		enum: EVENT_TYPES,
		required: false,
	})
	@IsEnum(() => EVENT_TYPES)
	@IsOptional()
	type?: EVENT_TYPES;
}
