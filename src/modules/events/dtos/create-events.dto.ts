import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsInt,
	IsMilitaryTime,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { EVENT_FORMAT, EVENT_TYPES } from "../events.entity";

import { ContactDto } from "./contact.dto";

export class CreateEventsDto {
	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	@IsString()
	title!: string;

	@ApiProperty({
		required: true,
		maxLength: 1000,
		minLength: 3,
	})
	@IsString()
	description!: string;
	userId: string | undefined;

	@ApiProperty({
		type: "enum",
		enum: EVENT_TYPES,
		required: true,
	})
	@IsEnum(EVENT_TYPES)
	type!: EVENT_TYPES;

	@ApiProperty({ type: Number })
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	city_id!: number;

	@ApiProperty({})
	@IsString()
	@IsNotEmpty()
	location!: string;

	@ApiProperty({})
	@IsMilitaryTime()
	@IsNotEmpty()
	start_time!: Date;

	@ApiProperty({})
	@IsMilitaryTime()
	@IsNotEmpty()
	end_time!: Date;

	@ApiProperty({})
	@IsDateString()
	@IsNotEmpty()
	date!: string;

	@ApiProperty({})
	@IsString()
	@IsNotEmpty()
	leader!: string;

	@ApiProperty({})
	@IsInt()
	@IsNotEmpty()
	max_visitors!: number;

	@ApiProperty({})
	@IsString()
	@IsNotEmpty()
	photo!: string;

	@ApiProperty({ enum: EVENT_FORMAT })
	@IsEnum(EVENT_FORMAT)
	@IsNotEmpty()
	format!: EVENT_FORMAT;

	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	is_banner?: boolean;

	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	is_draft?: boolean;

	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(ContactDto) }],
		type: () => [ContactDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => ContactDto)
	contacts!: ContactDto[];
}
