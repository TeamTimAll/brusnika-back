import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMobilePhone,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

import { Uuid } from "boilerplate.polyfill";

import { LeadOpStatus } from "../../leads/lead_ops.entity";

export class FilterClientDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	fullname?: string;

	@ApiProperty()
	@IsMobilePhone()
	@IsOptional()
	phone_number?: string;

	@ApiProperty()
	@IsUUID("4")
	@IsOptional()
	project_id?: Uuid;

	@ApiProperty()
	@IsDateString()
	@IsOptional()
	actived_from_date?: Date;

	@ApiProperty()
	@IsDateString()
	@IsOptional()
	actived_to_date?: Date;

	@ApiProperty()
	@IsEnum(() => LeadOpStatus)
	status?: LeadOpStatus;
}
