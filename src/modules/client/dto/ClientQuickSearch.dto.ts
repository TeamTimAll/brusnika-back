import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { Transform } from "class-transformer";

import { Limit, Page } from "../../../decorators";
import { LeadState } from "../../leads/leads.entity";

export class ClientQuickSearchDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 10;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	text!: string;

	@ApiProperty({ required: false, enum: LeadState })
	@IsEnum(LeadState)
	@IsOptional()
	state?: LeadState;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}
