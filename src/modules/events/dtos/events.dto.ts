import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";

import { BaseDto } from "../../../common/dto/abstract.dto";

export class EventsDto extends BaseDto {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	info?: string;
}

export enum EVENT_TYPES {
	PRESENTATION = "presentation",
	EXCURSION = "excursion",
	TRAINING = "training",
	TESTING = "testing",
}

export enum EVENT_FORMAT {
	ONLINE = "online",
	OFFLINE = "offline",
}

export class FilterEventsDto {
	@ApiProperty({
		required: false,
		type: "enum",
		enum: EVENT_FORMAT,
		description: "Event format",
	})
	@IsEnum(EVENT_FORMAT)
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
	@IsEnum(EVENT_TYPES)
	@IsOptional()
	type?: EVENT_TYPES;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	date?: string;
}
