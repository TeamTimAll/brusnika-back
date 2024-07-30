import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
	IsBoolean,
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
} from "class-validator";

import { Limit, Page } from "../../../decorators/pagination";

export class EventsDto {
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

export enum QueryType {
	FEATURE = "FEATURE",
	ALL = "ALL",
}

export class FilterEventsDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

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
		enum: QueryType,
		description:
			"In this enum, Feature represents the default feature where events planned for the future are given, and All represents reading all events.",
	})
	query_type: QueryType = QueryType.FEATURE;

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

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_draft?: boolean;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_banner?: boolean;
}
