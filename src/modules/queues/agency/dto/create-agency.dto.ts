import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AgencyDto {
	@IsString()
	ext_id!: string | null;

	@IsString()
	city_ext_id?: string | null;

	@IsString()
	user_ext_id?: string | null;

	@IsString()
	title!: string | null;

	@IsString()
	legalName?: string | null;

	@IsString()
	inn?: string | null;

	@IsString()
	phone?: string | null;

	@IsString()
	email?: string | null;

	@IsString()
	ownerFullName?: string | null;

	@IsString()
	ownerPhone?: string | null;

	@IsString()
	entry_doc?: string | null;

	@IsString()
	company_card_doc?: string | null;

	@IsString()
	tax_registration_doc?: string | null;

	@IsString()
	authority_signatory_doc?: string | null;
}

export class AgenciesDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => AgencyDto)
	data!: AgencyDto[];
}
