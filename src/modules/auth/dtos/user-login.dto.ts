import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsMobilePhone,
	IsNotEmpty,
	IsNumber,
	IsString,
	IsUUID,
} from "class-validator";

import { Uuid } from "boilerplate.polyfill";

import { RoleType } from "../../../constants";
import {
	CreateAgenciesDto,
	CreateExistentAgenciesDto,
} from "../../agencies/dtos/create-agencies.dto";

export class UserLoginDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	readonly email!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	readonly password!: string;
}

export class AgentLoginDto {
	@IsMobilePhone()
	@ApiProperty({
		required: true,
	})
	readonly phone!: string;
}

export class AgentChooseAgencyDto {
	@IsUUID()
	@ApiProperty({
		required: true,
	})
	user_id!: Uuid;

	@IsUUID()
	@ApiProperty({
		required: true,
	})
	agency_id!: Uuid;

	@IsDateString()
	@ApiProperty({
		required: true,
	})
	startWorkDate!: Date;
}

export class AgentRegisterAgencyDto extends CreateAgenciesDto {
	@IsUUID()
	@ApiProperty({
		required: true,
	})
	user_id!: Uuid;

	@IsBoolean()
	@ApiProperty({
		required: true,
	})
	isOwner!: boolean;
}

export class AgentRequestAgencyDto extends CreateExistentAgenciesDto {
	@IsUUID()
	@ApiProperty({
		required: true,
	})
	user_id!: Uuid;
}

export class UserLoginVerifyCodeDto {
	@IsNumber()
	@ApiProperty({
		required: true,
	})
	code!: number;

	@IsUUID()
	@ApiProperty({
		required: true,
	})
	user_id!: Uuid;
}

export class UserLoginResendCodeDto {
	@ApiProperty({
		required: true,
	})
	@IsMobilePhone()
	readonly phone!: string;
}

export class LoginSuccess {
	@IsString()
	@ApiProperty({ description: "access token identity" })
	access_token_id: string | undefined;

	@ApiProperty({
		type: "enum",
		enum: RoleType,
		enumName: "RoleType",
	})
	@IsString()
	role: RoleType | undefined;
}
