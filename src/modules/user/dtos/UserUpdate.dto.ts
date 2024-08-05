import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEmail,
	IsInt,
	IsOptional,
	IsString,
	MaxLength,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UserUpdateDto {
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
	// @MinDate(new Date('1900-01-01'), { message: 'Birth date must be after 1900-01-01' })
	// @MaxDate(new Date('2015-01-01'), { message: 'Birth date must be before 2015-01-01' })
	birthDate?: Date;

	@ApiProperty({
		required: false,
		description: "The ID of the city where the user resides",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}

export class UserUpdateMetaDataDto extends BaseDto<UserUpdateDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UserUpdateDto) }],
		type: () => UserUpdateDto,
	})
	@ValidateNested()
	@Type(() => UserUpdateDto)
	declare data: UserUpdateDto;
}
