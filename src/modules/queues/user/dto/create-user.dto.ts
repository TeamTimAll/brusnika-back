import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

import { RoleType } from "../../../../constants";
import { UserRegisterStatus, UserStatus } from "../../../user/user.entity";

export class UserDto {
	@IsString()
	ext_id!: string;

	@IsString()
	firstName!: string;

	@IsString()
	lastName!: string;

	@IsEnum(RoleType)
	role!: RoleType;

	@IsString()
	email!: string;

	@IsString()
	username!: string;

	@IsString()
	password!: string;

	@IsString()
	phone!: string;

	@IsString()
	birthDate!: Date;

	@IsString()
	workStartDate!: Date;

	@IsString()
	avatar!: string;

	@IsEnum(UserRegisterStatus)
	register_status!: UserRegisterStatus;

	@IsString()
	fullName!: string;

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
	city_ext_id?: string;

	@IsString()
	@IsOptional()
	agency_ext_id?: string;
}
