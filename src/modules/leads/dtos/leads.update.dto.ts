import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";

import { LeadOpStatus } from "../lead_ops.entity";

export class UpdateLeadDto {
	@ApiProperty()
	@IsInt()
	leadId!: number;

	@ApiProperty({ enum: LeadOpStatus })
	@IsEnum(LeadOpStatus)
	toStatus!: LeadOpStatus;
}
