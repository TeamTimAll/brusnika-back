import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";

import { LeadOpStatus } from "../lead_ops.entity";

export class UpdateLeadDto {
	@ApiProperty()
	@IsUUID("4")
	leadId!: string;

	@ApiProperty({ enum: LeadOpStatus })
	@IsEnum(LeadOpStatus)
	toStatus!: LeadOpStatus;
}
