import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";
import { Type } from "class-transformer";

import { LeadOpStatus } from "../lead_ops.entity";

export class UpdateLeadDto {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	leadId!: number;

	@ApiProperty({ enum: LeadOpStatus })
	@IsEnum(LeadOpStatus)
	toStatus!: LeadOpStatus;
}
