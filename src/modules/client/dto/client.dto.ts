import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

import { ClientTag } from "../client.entity";

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

	agent_id?: string;

	@ApiProperty({ default: "some comment about client" })
	@IsString()
	@IsOptional()
	comment?: string;

	@ApiProperty({ default: ClientTag.LEAD_VERIFICATION })
	@IsEnum(ClientTag)
	@IsOptional()
	status?: ClientTag;

	@ApiProperty({ default: new Date() })
	@IsDateString()
	@IsNotEmpty()
	expiration_date!: Date;

	@ApiProperty({ default: "this client is not responding" })
	@IsString()
	@IsOptional()
	node?: string;
}
