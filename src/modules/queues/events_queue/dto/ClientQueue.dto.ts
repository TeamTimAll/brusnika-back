import {
	IsDateString,
	IsEnum,
	IsMobilePhone,
	IsOptional,
	IsString,
} from "class-validator";

import { ConfirmationType, FixingType } from "../../../client/client.entity";

export class ClientQueueDto {
	@IsString()
	ext_id!: string | null;

	@IsString()
	fullname!: string;

	@IsMobilePhone()
	phone_number!: string;

	@IsString()
	@IsOptional()
	agent_ext_id!: string | null;

	@IsString()
	@IsOptional()
	comment?: string;

	@IsEnum(FixingType)
	@IsOptional()
	fixing_type?: FixingType;

	@IsDateString()
	expiration_date!: Date;

	@IsString()
	@IsOptional()
	node?: string;

	@IsEnum(ConfirmationType)
	confirmation_type!: ConfirmationType;

	@IsDateString()
	actived_date!: string | null;
}
