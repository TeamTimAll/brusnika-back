import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}
