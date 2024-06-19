import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMilitaryTime,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

import { EVENT_FORMAT, EVENT_TYPES } from "../events.entity";

export class CreateEventsDto {
	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	title!: string;

	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	description!: string;

	@IsEnum(() => EVENT_TYPES)
	@ApiProperty({
		type: "enum",
		enum: EVENT_TYPES,
		required: true,
	})
	type!: EVENT_TYPES;

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		maxLength: 1000,
		minLength: 3,
	})
	location?: string;

	@IsString()
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	photo!: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		maxLength: 1000,
		minLength: 3,
	})
	leader?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		maxLength: 1000,
		minLength: 3,
	})
	phone?: string;

	@IsDateString()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: "Date start event",
	})
	date?: Date;

	@IsMilitaryTime()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: "Time start event",
	})
	start_time?: Date;

	@IsMilitaryTime()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: "Time end event",
	})
	end_time?: Date;

	@IsOptional()
	@IsNumber()
	@ApiProperty({
		required: false,
		description: "Max visitors",
	})
	max_visitors?: number;

	//format
	@IsEnum(() => EVENT_FORMAT)
	@ApiProperty({
		required: true,
		type: "enum",
		enum: EVENT_FORMAT,
		description: "Event format",
	})
	format!: EVENT_FORMAT;

	@IsUUID()
	@ApiProperty({
		required: true,
		description: "City id",
	})
	city_id!: string;
}
