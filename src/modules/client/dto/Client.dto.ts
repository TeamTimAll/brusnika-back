import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

import { ConfirmationType, FixingType } from "../client.entity";

export class ClientDto {
	@ApiProperty({ default: "client fullname" })
	@IsString()
	@IsNotEmpty()
	fullname!: string;

	@ApiProperty({ default: "+7894561" })
	@IsMobilePhone()
	@IsNotEmpty()
	phone_number!: string;

	@ApiProperty({ default: new Date() })
	@IsDateString()
	@IsNotEmpty()
	actived_date!: Date;

	agent_id?: number;

	@ApiProperty({ default: "some comment about client" })
	@IsString()
	@IsOptional()
	comment?: string;

	@ApiProperty({ enum: FixingType, default: FixingType.LEAD_VERIFICATION })
	@IsEnum(FixingType)
	@IsOptional()
	fixing_type?: FixingType;

	@ApiProperty({ default: new Date() })
	@IsDateString()
	@IsNotEmpty()
	expiration_date!: Date;

	@ApiProperty({ default: "this client is not responding" })
	@IsString()
	@IsOptional()
	node?: string;

	@ApiProperty({ enum: ConfirmationType, default: ConfirmationType.SMS })
	@IsEnum(ConfirmationType)
	@IsNotEmpty()
	confirmation_type!: ConfirmationType;
}
