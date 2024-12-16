import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEmail,
	IsInt,
	IsMobilePhone,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateAgenciesV2Dto {
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
	contactPersonName?: string;

	@ApiProperty({
		default: "78652385693",
		description: "The phone number of the owner",
		required: false,
	})
	@IsOptional()
	@IsMobilePhone()
	contactPersonPhone?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	contactPersonPosition?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	organizationalLegalForm?: string;

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

	@ApiProperty({
		default: "2024-12-12",
		required: false,
	})
	@IsOptional()
	@IsString()
	registrationAgencyDate?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	vatAvailability?: boolean;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	debug?: boolean;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsInt()
	termCount?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	termUnit?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsInt()
	employees?: number;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	okved?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	site?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	amountDealsMonth?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString({ each: true })
	citiesWork?: string[];

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString({ each: true })
	agreementsAnotherDeveloper?: string[];

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString({ each: true })
	associations?: string[];

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	reasonAgreements?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	signer?: string;

	@ApiProperty({
		required: false,
	})
	@IsOptional()
	@IsString()
	basisForSigning?: string;
}

export class CreateAgenciesV2MetaDataDto extends BaseDto<CreateAgenciesV2Dto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateAgenciesV2Dto) }],
		type: () => CreateAgenciesV2Dto,
	})
	@ValidateNested()
	@Type(() => CreateAgenciesV2Dto)
	declare data: CreateAgenciesV2Dto;
}
