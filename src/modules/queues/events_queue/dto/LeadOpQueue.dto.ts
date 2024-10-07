import { IsEnum, IsString } from "class-validator";

import { LeadOpStatus } from "../../../leads/lead_ops.entity";

export class LeadOpQueueDto {
	@IsString()
	ext_id!: string;

	@IsString()
	lead_ext_id!: string;

	@IsEnum(LeadOpStatus)
	status!: LeadOpStatus;
}
