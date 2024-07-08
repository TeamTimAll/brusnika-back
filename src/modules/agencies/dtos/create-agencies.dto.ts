import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsEmail,
	IsInt,
	IsMobilePhone,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateAgenciesDto {
	@ApiProperty({ description: "The title of the agency" })
	@IsString()
	title!: string;

	@ApiProperty({ description: "The UUID of the city" })
	@IsInt()
	@Type(() => Number)
	city_id!: number;

	@ApiProperty({ description: "The legal name of the agency" })
	@IsString()
	legalName?: string;

	@ApiProperty({
		description: "The tax identification number of the agency",
	})
	@IsString()
	inn?: string;

	@ApiProperty({ description: "The phone number of the agency" })
	@IsMobilePhone()
	phone?: string;

	@ApiProperty({ description: "The email address of the agency" })
	@IsEmail()
	email?: string;

	@ApiProperty({ description: "The full name of the owner", required: false })
	@IsOptional()
	@IsString()
	ownerFullName?: string;

	@ApiProperty({
		description: "The phone number of the owner",
		required: false,
	})
	@IsOptional()
	@IsMobilePhone()
	ownerPhone?: string;

	@ApiProperty({ description: "Document for entry", required: false })
	@IsOptional()
	@IsString()
	entry_doc?: string;

	@ApiProperty({ description: "Document for company card", required: false })
	@IsOptional()
	@IsString()
	company_card_doc?: string;

	@ApiProperty({
		description: "Document for tax registration",
		required: false,
	})
	@IsOptional()
	@IsString()
	tax_registration_doc?: string;

	@ApiProperty({
		description: "Document for authority signatory",
		required: false,
	})
	@IsOptional()
	@IsString()
	authority_signatory_doc?: string;
}

export class CreateExistentAgenciesDto {
	@ApiProperty({ description: "The title of the agency" })
	@IsString()
	title!: string;

	@ApiProperty({ description: "The UUID of the city" })
	@IsInt()
	@Type(() => Number)
	city_id!: number;

	@ApiProperty({ description: "The full name of the owner" })
	@IsString()
	ownerFullName!: string;

	@ApiProperty({ description: "The phone number of the owner" })
	@IsMobilePhone()
	ownerPhone!: string;
}
