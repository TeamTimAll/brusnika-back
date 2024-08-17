import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";

export class UserUpdateRoleDto {
	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	id!: number;

	@ApiProperty({ enum: RoleType })
	@IsEnum(RoleType)
	@IsOptional()
	role!: RoleType;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	is_blocked?: boolean = false;

	@ApiProperty({ required: false, description: "The first name of the user" })
	@IsString()
	@IsOptional()
	@MaxLength(50, { message: "First name cannot exceed 50 characters" })
	firstName?: string;

	@ApiProperty({ required: false, description: "The last name of the user" })
	@IsString()
	@IsOptional()
	@MaxLength(50, { message: "Last name cannot exceed 50 characters" })
	lastName?: string;

	@ApiProperty({
		required: false,
		description: "The email address of the user",
	})
	@IsEmail()
	@IsOptional()
	@MaxLength(100, { message: "Email address cannot exceed 100 characters" })
	email?: string;

	@ApiProperty({ required: false, description: "The avatar URL of the user" })
	@IsString()
	@IsOptional()
	@MaxLength(200, { message: "Avatar URL cannot exceed 200 characters" })
	avatar?: string;

	@ApiProperty({
		required: false,
		description: "The birth date of the user",
		example: "1990-01-01",
	})
	@IsDateString()
	@IsOptional()
	birthDate?: Date;

	@ApiProperty({
		required: false,
		description: "The ID of the city where the user resides",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;

	@ApiProperty({
		required: false,
		description: "The ID of the agency",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	agency_id?: number;
}

export class UserUpdateRoleMetaDataDto extends BaseDto<UserUpdateRoleDto> {
	@ApiProperty({ type: UserUpdateRoleDto })
	declare data: UserUpdateRoleDto;
}
