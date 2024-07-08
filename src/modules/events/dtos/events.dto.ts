import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";

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
	@IsEnum(() => EVENT_FORMAT)
	@IsOptional()
	@ApiProperty({
		required: false,
		type: "enum",
		enum: EVENT_FORMAT,
		description: "Event format",
	})
	format!: EVENT_FORMAT;

	@IsOptional()
	@ApiProperty({
		required: false,
		description: "City id",
	})
	@IsInt()
	city_id!: number;

	@IsEnum(() => EVENT_TYPES)
	@IsOptional()
	@ApiProperty({
		type: "enum",
		enum: EVENT_TYPES,
		required: false,
	})
	type!: EVENT_TYPES;
}
