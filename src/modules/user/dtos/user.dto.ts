import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsDate,
	IsDateString,
	IsEmail,
	IsEnum,
	IsInt,
	IsMobilePhone,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { RoleType } from "../../../constants";
import { UserEntity, UserRegisterStatus } from "../user.entity";

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends BaseDto {
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
	register_status: UserRegisterStatus;

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

	status: boolean;

	constructor(user: UserEntity) {
		super(user);
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.role = user.role;
		this.email = user.email;
		this.username = user.username;
		this.password = user.password;
		this.phone = user.phone;
		this.birthDate = user.birthDate;
		this.workStartDate = user.workStartDate;
		this.verification_code = user.verification_code;
		this.verification_code_sent_date = user.verification_code_sent_date;
		this.avatar = user.avatar;
		this.register_status = user.register_status;
		this.isPhoneVerified = user.isPhoneVerified;
		this.temporaryNumber = user.temporaryNumber;
		this.status = user.status;
		this.city_id = user.city?.id;
		this.agency_id = user.agency?.id;
	}
}

export class UserCreateDto {
	@IsMobilePhone()
	@ApiProperty({ required: true })
	phone!: string;

	role?: RoleType;
}

export class UserChangePhoneVerifyCodeDto {
	@IsNumber()
	@ApiProperty({
		required: true,
	})
	code!: number;
}

export class UserUpdateDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false, description: "The first name of the user" })
	@MaxLength(50, { message: "First name cannot exceed 50 characters" })
	firstName?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false, description: "The last name of the user" })
	@MaxLength(50, { message: "Last name cannot exceed 50 characters" })
	lastName?: string;

	@IsEmail()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: "The email address of the user",
	})
	@MaxLength(100, { message: "Email address cannot exceed 100 characters" })
	email?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false, description: "The avatar URL of the user" })
	@MaxLength(200, { message: "Avatar URL cannot exceed 200 characters" })
	avatar?: string;

	@IsDateString()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: "The birth date of the user",
		example: "1990-01-01",
	})
	// @MinDate(new Date('1900-01-01'), { message: 'Birth date must be after 1900-01-01' })
	// @MaxDate(new Date('2015-01-01'), { message: 'Birth date must be before 2015-01-01' })
	birthDate?: Date;

	@IsInt()
	@Type(() => Number)
	@IsOptional()
	@ApiProperty({
		required: false,
		description: "The ID of the city where the user resides",
	})
	city_id?: number;
}

export class UserFillDataDto {
	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		required: true,
	})
	id!: number;

	@IsString()
	@ApiProperty({
		required: true,
	})
	firstName!: string;

	@IsString()
	@ApiProperty({
		required: true,
	})
	lastName!: string;

	@ApiProperty({
		required: true,
	})
	@IsInt()
	@Type(() => Number)
	city_id!: number;

	@IsDateString()
	@ApiProperty({ required: true })
	birthDate!: Date;

	@IsEmail()
	@ApiProperty({ required: true })
	email!: string;
}

export class UserLoginDto {
	@IsEmail()
	readonly email!: string;

	@IsString()
	readonly password!: string;
}
