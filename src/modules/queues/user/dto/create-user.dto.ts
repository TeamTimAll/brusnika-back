import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { RoleType } from "../../../../constants";
import { UserRegisterStatus, UserStatus } from "../../../user/user.entity";

export class UserDto {
	@IsString()
	ext_id!: string | null;

	@IsString()
	firstName!: string | null;

	@IsString()
	lastName!: string | null;

	@IsEnum(RoleType)
	role!: RoleType;

	@IsString()
	email?: string | null;

	@IsString()
	username!: string | null;

	@IsString()
	password!: string | null;

	@IsString()
	phone!: string | null;

	@IsString()
	birthDate!: Date | null;

	@IsString()
	workStartDate!: Date | null;

	@IsString()
	avatar!: string | null;

	@IsEnum(UserRegisterStatus)
	register_status!: UserRegisterStatus;

	@IsBoolean()
	@IsOptional()
	is_phone_verified?: boolean;

	@IsBoolean()
	@IsOptional()
	is_email_verified?: boolean;

	@IsEnum(RoleType)
	@IsOptional()
	temporary_role?: RoleType;

	@IsEnum(UserStatus)
	status!: UserStatus;

	@IsString()
	@IsOptional()
	city_ext_id?: string | null;

	@IsString()
	@IsOptional()
	agency_ext_id?: string | null;
}

export class UsersDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => UserDto)
	data!: UserDto[];
}
