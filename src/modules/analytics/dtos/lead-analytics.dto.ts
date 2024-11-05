import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

import { LeadOpStatus } from "../../leads/lead_ops.entity";

export class LeadAnalyticsDto {
	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	toDate!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	fromDate!: Date;

	@ApiPropertyOptional({ enum: LeadOpStatus })
	@IsOptional()
	@IsEnum(LeadOpStatus)
	status?: LeadOpStatus;

	@ApiPropertyOptional({ default: 1, description: "The id of the city" })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}
