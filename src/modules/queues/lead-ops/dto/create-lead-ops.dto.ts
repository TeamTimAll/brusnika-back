import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { LeadOpStatus } from "../../../leads/lead_ops.entity";

export class LeadOpsDto {
	@IsString()
	ext_id!: string;

	@IsString()
	lead_ext_id!: string;

	@IsEnum(LeadOpStatus)
	status!: LeadOpStatus;
}

export class LeadOpsesDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => LeadOpsDto)
	data!: LeadOpsDto[];
}
