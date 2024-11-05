import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import {
	CommercialStatus,
	PremiseFeature,
	PremisesType,
	PuchaseOptions,
} from "../../../premises/premises.entity";

export class PremiseDto {
	@IsString()
	ext_id!: string;

	@IsEnum(PremisesType)
	type!: PremisesType;

	@IsString()
	building_ext_id!: string;

	@IsNumber()
	price!: bigint;

	@IsNumber()
	size!: number;

	@IsEnum(CommercialStatus)
	@IsOptional()
	status?: CommercialStatus;

	@IsNumber()
	@IsOptional()
	number?: number;

	@IsString()
	@IsOptional()
	link?: string;

	@IsNumber()
	@IsOptional()
	floor?: number;

	@IsString()
	@IsOptional()
	photo?: string;

	@IsNumber()
	@IsOptional()
	rooms?: number;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	photos?: string[];

	@IsNumber()
	@IsOptional()
	similiarApartmentCount?: number;

	@IsNumber()
	@IsOptional()
	mortagePayment?: number;

	@IsString()
	@IsOptional()
	section_ext_id?: string;

	@IsEnum(PuchaseOptions, { each: true })
	@IsOptional()
	purchase_option?: PuchaseOptions[];

	@IsEnum(PremiseFeature, { each: true })
	@IsOptional()
	feature?: PremiseFeature[];
}
