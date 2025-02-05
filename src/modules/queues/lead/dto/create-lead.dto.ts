import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { LeadOpStatus } from "../../../leads/lead_ops.entity";
import { LeadState } from "../../../leads/leads.entity";

export class LeadDto {
	@IsString()
	ext_id!: string;

	@IsString()
	client_ext_id!: string;

	@IsString()
	agent_ext_id!: string;

	@IsString()
	@IsOptional()
	manager_ext_id?: string;

	@IsString()
	@IsOptional()
	comment?: string;

	@IsEnum(LeadOpStatus)
	current_status!: LeadOpStatus;

	@IsString()
	premise_ext_id!: string;

	@IsString()
	lead_number!: string;

	@IsString()
	project_ext_id!: string;

	@IsNumber()
	fee!: number;

	@IsEnum(LeadState)
	state!: LeadState;

	@IsDate()
	start_date!: Date;
}

export class LeadsDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => LeadDto)
	data!: LeadDto[];
}
