import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMobilePhone,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

import { LeadOpStatus } from "../../leads/lead_ops.entity";
import { LeadState } from "../../leads/leads.entity";

export class FilterClientDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	fullname?: string;

	@ApiProperty({ required: false })
	@IsMobilePhone()
	@IsOptional()
	phone_number?: string;

	@ApiProperty({ required: false })
	@IsUUID("4")
	@IsOptional()
	project_id?: string;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	actived_from_date?: Date;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	actived_to_date?: Date;

	@ApiProperty({ required: false, enum: LeadOpStatus })
	@IsEnum(LeadOpStatus)
	@IsOptional()
	status?: LeadOpStatus;

	@ApiProperty({ required: false, enum: LeadState })
	@IsEnum(LeadState)
	@IsOptional()
	state?: string;
}
