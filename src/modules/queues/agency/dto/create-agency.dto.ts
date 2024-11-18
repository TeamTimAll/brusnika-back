import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AgencyDto {
	@IsString()
	ext_id!: string;

	@IsString()
	city_ext_id!: string;

	@IsString()
	title!: string;

	@IsString()
	legalName?: string;

	@IsString()
	inn?: string;

	@IsString()
	phone?: string;

	@IsString()
	email?: string;

	@IsString()
	ownerFullName?: string;

	@IsString()
	ownerPhone?: string;

	@IsString()
	entry_doc?: string;

	@IsString()
	company_card_doc?: string;

	@IsString()
	tax_registration_doc?: string;

	@IsString()
	authority_signatory_doc?: string;
}

export class AgenciesDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => AgencyDto)
	data!: AgencyDto[];
}
