import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";

import { Uuid } from "boilerplate.polyfill";

import { LeadOpStatus } from "../lead_ops.entity";

export class UpdateLeadDto {
	@ApiProperty()
	@IsUUID("4")
	leadId!: Uuid;

	@ApiProperty({ enum: LeadOpStatus })
	@IsEnum(LeadOpStatus)
	toStatus!: LeadOpStatus;
}
