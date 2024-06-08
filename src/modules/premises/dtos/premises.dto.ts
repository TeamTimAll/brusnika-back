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

import { Uuid } from "boilerplate.polyfill";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { CommercialStatus, PremisesType } from "../premises.entity";

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

	@ApiProperty({ example: "123e4567-e 89b-12d3-a456-426614174000" ,required: false})
	@IsOptional()
	@IsString()
	section_id?: string;
}

export class PremisesFilterDto {
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
	type!: PremisesType | undefined;

	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		description: "Section ID",
		required: false,
	})
	@IsOptional()
	@IsUUID()
	section_id?: Uuid;

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
	project_id?: Uuid;

	@ApiProperty({
		example: "123e4567-e89b-12d3-a456-426614174000",
		required: false,
	})
	@IsOptional()
	@IsUUID()
	building_id?: Uuid;

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
}
