import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsInt,
	IsMobilePhone,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { RoleType } from "../../../constants";
import { UserRegisterStatus } from "../user.entity";

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto {
	@IsString()
	@IsOptional()
	firstName?: string | null;

	@IsString()
	@IsOptional()
	lastName?: string | null;

	@IsString()
	@IsOptional()
	username!: string;

	@IsString()
	@IsOptional()
	password!: string;

	@IsEnum(RoleType)
	role?: RoleType;

	@IsEmail()
	@IsOptional()
	@ApiProperty({ required: false })
	email?: string | null;

	@IsString()
	@IsOptional()
	avatar?: string | null;

	@IsMobilePhone()
	@IsOptional()
	phone?: string | null;

	@IsMobilePhone()
	@IsOptional()
	temporaryNumber?: string | null;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@IsDate()
	@IsOptional()
	@ApiProperty({ required: false })
	birthDate?: Date | null;

	@IsDate()
	@IsOptional()
	@ApiProperty({ required: false })
	workStartDate?: Date | null;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ required: false })
	verification_code?: number | null;

	@IsDate()
	@IsOptional()
	@ApiProperty({ required: false })
	verification_code_sent_date?: Date | null;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(() => UserRegisterStatus)
	register_status?: UserRegisterStatus;

	@IsBoolean()
	@IsOptional()
	@ApiProperty({ required: false })
	isPhoneVerified?: boolean;

	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		required: false,
	})
	city_id?: number;

	@ApiProperty({ description: "The agency ID of the user" })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	agency_id?: number;

	status?: boolean;
}
