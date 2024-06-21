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
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname!: string;

	@ApiProperty()
	@IsMobilePhone()
	@IsNotEmpty()
	phone_number!: string;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	actived_date!: Date;

	@ApiProperty()
	@IsString()
	@IsOptional()
	comment?: string;

	@ApiProperty()
	@IsEnum(() => ClientTag)
	@IsNotEmpty()
	status?: ClientTag;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	expiration_date!: Date;

	@ApiProperty()
	@IsString()
	@IsOptional()
	node?: string;
}
