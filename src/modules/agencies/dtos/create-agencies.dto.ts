import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsEmail,
	IsInt,
	IsMobilePhone,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateAgenciesDto {
	@ApiProperty({
		default: "Louisville KY",
		description: "The title of the agency",
	})
	@IsString()
	title!: string;

	@ApiProperty({ default: 1, description: "The id of the city" })
	@IsInt()
	@Type(() => Number)
	city_id!: number;

	@ApiProperty({
		default: "Louisville KY LLC",
		description: "The legal name of the agency",
	})
	@IsString()
	legalName?: string;

	@ApiProperty({
		default: "",
		description: "The tax identification number of the agency",
	})
	@IsString()
	inn?: string;

	@ApiProperty({
		default: "78652385693",
		description: "The phone number of the agency",
	})
	@IsMobilePhone()
	phone?: string;

	@ApiProperty({
		default: "russian@gmail.com",
		description: "The email address of the agency",
	})
	@IsEmail()
	email?: string;

	@ApiProperty({
		default: "Ivan",
		description: "The full name of the owner",
		required: false,
	})
	@IsOptional()
	@IsString()
	ownerFullName?: string;

	@ApiProperty({
		default: "78652385693",
		description: "The phone number of the owner",
		required: false,
	})
	@IsOptional()
	@IsMobilePhone()
	ownerPhone?: string;

	@ApiProperty({
		default: "",
		description: "Document for entry",
		required: false,
	})
	@IsOptional()
	@IsString()
	entry_doc?: string;

	@ApiProperty({
		default: "",
		description: "Document for company card",
		required: false,
	})
	@IsOptional()
	@IsString()
	company_card_doc?: string;

	@ApiProperty({
		default: "",
		description: "Document for tax registration",
		required: false,
	})
	@IsOptional()
	@IsString()
	tax_registration_doc?: string;

	@ApiProperty({
		default: "",
		description: "Document for authority signatory",
		required: false,
	})
	@IsOptional()
	@IsString()
	authority_signatory_doc?: string;
}

export class CreateAgenciesMetaDataDto extends BaseDto<CreateAgenciesDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateAgenciesDto) }],
		type: () => CreateAgenciesDto,
	})
	@ValidateNested()
	@Type(() => CreateAgenciesDto)
	declare data: CreateAgenciesDto;
}

export class CreateExistentAgenciesDto {
	@ApiProperty({
		default: "Louisville KY",
		description: "The title of the agency",
	})
	@IsString()
	title!: string;

	@ApiProperty({ default: 1, description: "The id of the city" })
	@IsInt()
	@Type(() => Number)
	city_id!: number;

	@ApiProperty({
		default: "Ivan",
		description: "The full name of the owner",
		required: false,
	})
	@IsOptional()
	@IsString()
	ownerFullName?: string;

	@ApiProperty({
		default: "78652385693",
		description: "The phone number of the owner",
		required: false,
	})
	@IsOptional()
	@IsMobilePhone()
	ownerPhone?: string;
}
