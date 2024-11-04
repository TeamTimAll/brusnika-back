import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
import { LeadOpStatus } from "../../leads/lead_ops.entity";
import { FixingType } from "../client.entity";

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

	@ApiProperty({ required: false, enum: LeadOpStatus })
	@IsOptional()
	@IsEnum(LeadOpStatus)
	status?: LeadOpStatus;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;

	@ApiPropertyOptional({ enum: FixingType, default: FixingType.LEAD_VERIFICATION })
	@IsEnum(FixingType)
	@IsOptional()
	fixing_type?: FixingType;
}
