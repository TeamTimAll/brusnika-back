import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

import { EVENT_TYPES } from "../events.entity";

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
	userId: string | undefined;

	@IsEnum(EVENT_TYPES)
	@ApiProperty({
		type: "enum",
		enum: EVENT_TYPES,
		required: true,
	})
	type!: EVENT_TYPES;
}
