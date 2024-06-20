import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { ClientStatus } from "../client.entity";

export class ClientDto extends BaseDto {
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
	actived_from_date!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	actived_to_date!: Date;

	@ApiProperty()
	@IsString()
	@IsOptional()
	comment?: string;

	@ApiProperty()
	@IsEnum(() => ClientStatus)
	@IsNotEmpty()
	status!: ClientStatus;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	expiration_date!: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	node?: string;
}
