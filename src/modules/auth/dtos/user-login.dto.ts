import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsInt,
	IsMobilePhone,
	IsNotEmpty,
	IsNumber,
	IsString,
} from "class-validator";

import { RoleType } from "../../../constants";
import {
	CreateAgenciesDto,
	CreateExistentAgenciesDto,
} from "../../agencies/dtos/create-agencies.dto";
import { UserRegisterStatus } from "../../user/user.entity";

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
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;

	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	agency_id!: number;

	@IsDateString()
	@ApiProperty({
		required: true,
	})
	startWorkDate!: Date;
}

export class AgentRegisterAgencyDto extends CreateAgenciesDto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;

	@IsBoolean()
	@ApiProperty({
		required: true,
	})
	isOwner!: boolean;
}

export class AgentRequestAgencyDto extends CreateExistentAgenciesDto {
	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	user_id!: number;
}

export class UserLoginVerifyCodeDto {
	@IsNumber()
	@ApiProperty({
		required: true,
	})
	code!: number;

	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		required: true,
	})
	user_id!: number;
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

export class AuthResponeWithToken {
	@ApiProperty({
		example: "jwt_token",
	})
	accessToken!: string;
}

export class AuthResponeWithData {
	@ApiProperty({
		example: 1,
	})
	user_id!: number;

	@ApiProperty({
		example: "sms sent | verified | ok",
	})
	message!: string;

	@ApiProperty({
		example: Object.values(UserRegisterStatus).join(" | "),
	})
	register_status!: string;
}
