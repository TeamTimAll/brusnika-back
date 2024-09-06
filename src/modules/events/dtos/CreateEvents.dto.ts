import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsMilitaryTime,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { EVENT_FORMAT, EVENT_TYPES } from "../events.entity";

import { EventContactDto } from "./EventContact.dto";

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

	@ApiProperty({ default: "00:00" })
	@IsMilitaryTime()
	@IsNotEmpty()
	start_time!: string;

	@ApiProperty({ default: "00:00" })
	@IsMilitaryTime()
	@IsNotEmpty()
	end_time!: string;

	@ApiProperty({ default: new Date() })
	@IsString()
	@Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, {
		message: "Date must be in the format yyyy-mm-dd",
	})
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

	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	push_notification?: boolean;

	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(EventContactDto) }],
		type: () => [EventContactDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => EventContactDto)
	contacts!: EventContactDto[];

	@ApiProperty({ required: false, default: [] })
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags?: string[];
}

export class CreateEventsMetaDataDto extends BaseDto<CreateEventsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateEventsDto) }],
		type: () => CreateEventsDto,
	})
	@ValidateNested()
	@Type(() => CreateEventsDto)
	declare data: CreateEventsDto;
}
