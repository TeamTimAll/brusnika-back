import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import {
	CommercialStatus,
	PremiseFeature,
	PremisesType,
	PuchaseOptions,
} from "../../../premises/premises.entity";

export class PremiseDto {
	@IsString()
	ext_id!: string;

	@IsString()
	name!: string;

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

	@IsNumber()
	@Max(360)
	@IsOptional()
	sun_noon_angle?: number;

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

export class PremisesDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PremiseDto)
	data!: PremiseDto[];
}
