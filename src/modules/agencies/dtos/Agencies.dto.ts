import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { AgencyEntity } from "../agencies.entity";

export type IAgencyDto = Omit<AgencyEntity, "city" | "user" | "create_by">;

export class AgencyDto implements IAgencyDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	ext_id!: string;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	title!: string;

	@ApiProperty()
	city_id?: number;

	@ApiProperty()
	legalName!: string;

	@ApiProperty()
	inn!: string;

	@ApiProperty()
	phone!: string;

	@ApiProperty()
	email!: string;

	@ApiProperty()
	ownerFullName!: string;

	@ApiProperty()
	ownerPhone!: string;

	@ApiProperty()
	entry_doc!: string;

	@ApiProperty()
	company_card_doc!: string;

	@ApiProperty()
	tax_registration_doc!: string;

	@ApiProperty()
	authority_signatory_doc!: string;

	@ApiProperty()
	create_by_id?: number;

	@ApiProperty()
	is_active!: boolean;
	
	@ApiProperty()
	agreementsAnotherDeveloper?: string[] | undefined;

	@ApiProperty()
	amountDealsMonth?: string | undefined;

	@ApiProperty()
	associations?: string[] | undefined;

	@ApiProperty()
	basisForSigning?: string | undefined;

	@ApiProperty()
	citiesWork?: string[] | undefined;

	@ApiProperty()
	contactPersonName!: string | null;

	@ApiProperty()
	contactPersonPhone!: string | null;

	@ApiProperty()
	contactPersonPosition!: string | null;

	@ApiProperty()
	employees?: number;

	@ApiProperty()
	okved!: string;

	@ApiProperty()
	registrationAgencyDate?: string;

	@ApiProperty()
	vatAvailability?: boolean;

	@ApiProperty()
	termCount!: number;

	@ApiProperty()
	termUnit!: string;

	@ApiProperty()
	organizationalLegalForm!: string | null;

	@ApiProperty()
	reasonAgreements?: string | undefined;

	@ApiProperty()
	signer?: string | undefined;
	
	@ApiProperty()
	site?: string | undefined;
}

export class AgencyMetaDataDto<T = AgencyDto>
	extends BaseDto<T>
	implements Dto
{
	@ApiProperty({ type: AgencyDto })
	declare data: T;

	desc = `### Agency ma'lumotlari
	\n **data**'da agency entity ma'lumotlari`;
}

export class AgencyArrayMetaDataDto extends AgencyMetaDataDto<AgencyDto[]> {
	@ApiProperty({ type: [AgencyDto] })
	declare data: AgencyDto[];
}
