import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { Limit, Page } from "../../../decorators/pagination";
import {
	CommercialStatus,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

export class PremisesDto extends BaseDto {
	@ApiProperty({ example: "Apartment 1" })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		enum: PremisesType,
		required: true,
	})
	@IsOptional()
	type!: PremisesType | undefined;

	@ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
	@IsOptional()
	@IsString()
	building_id?: string;

	@ApiProperty({ example: "1000" })
	@IsOptional()
	@IsString()
	price?: string;

	@ApiProperty({ example: "50" })
	@IsOptional()
	@IsNumber()
	size?: number;

	@IsEnum(() => CommercialStatus)
	@IsOptional()
	status?: CommercialStatus;

	@ApiProperty({ example: 2 })
	@IsOptional()
	@IsNumber()
	floor?: number;

	@ApiProperty({ example: "photo.jpg" })
	@IsOptional()
	@IsString()
	photo?: string;

	@ApiProperty({ example: 3 })
	@IsOptional()
	@IsNumber()
	rooms?: number;

	@ApiProperty({ example: ["photo1.jpg", "photo2.jpg"] })
	@IsOptional()
	@IsString({ each: true })
	photos?: string[];

	@ApiProperty({ example: 5 })
	@IsOptional()
	@IsNumber()
	similiarApartmentCount?: number;

	@ApiProperty({ example: "Apartment for rent" })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiProperty({ example: "2022-01-01" })
	@IsOptional()
	@IsString()
	end_date?: string;

	@ApiProperty({ example: 1 })
	@IsOptional()
	@IsNumber()
	number?: number;

	@ApiProperty({ example: "1000" })
	@IsOptional()
	@IsString()
	mortagePayment?: string;

	@ApiProperty({
		example: "123e4567-e 89b-12d3-a456-426614174000",
		required: false,
	})
	@IsOptional()
	@IsString()
	section_id?: string;

	@ApiProperty({ description: "Purchase option", required: false })
	@IsOptional()
	@IsEnum(PuchaseOptions)
	purchaseOption?: PuchaseOptions;
}

export class PremisesFilterDto {
	id?: string;
	ids?: string[];

	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsDateString()
	endYear?: Date;

	@ApiProperty({
		enum: PremisesType,
		description: "Premises type",
		required: false,
	})
	@IsOptional()
	type?: PremisesType | undefined;

	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "Section ID",
		required: false,
	})
	@IsOptional()
	@IsUUID()
	section_id?: string;

	@ApiProperty({ example: 3, required: false })
	@IsOptional()
	@IsNumberString()
	rooms?: string;

	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		required: false,
	})
	@IsOptional()
	@IsUUID()
	project_id?: string;

	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		required: false,
	})
	@IsOptional()
	@IsUUID()
	building_id?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_size?: string;

	@ApiProperty({ example: "50", required: false })
	@IsOptional()
	@IsNumberString()
	max_size?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_price?: string;

	@ApiProperty({ example: "50000000", required: false })
	@IsOptional()
	@IsNumberString()
	max_price?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_floor?: string;

	@ApiProperty({ example: "50", required: false })
	@IsOptional()
	@IsNumberString()
	max_floor?: string;

	@ApiProperty({ example: "1", required: false })
	@IsOptional()
	@IsNumberString()
	min_number?: string;

	@ApiProperty({ example: "50", required: false })
	@IsOptional()
	@IsNumberString()
	max_number?: string;

	@ApiProperty({ required: false, enum: CommercialStatus })
	@IsEnum(() => CommercialStatus)
	@IsOptional()
	status?: CommercialStatus;

	@ApiProperty({ required: false, enum: PuchaseOptions })
	@IsOptional()
	@IsEnum(PuchaseOptions)
	purchaseOption?: PuchaseOptions;
}

export class PremisesIdsDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsUUID("4", { each: true })
	ids?: string[];
}
