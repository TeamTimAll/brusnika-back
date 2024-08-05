import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

import {
	CommercialStatus,
	PremisesType,
	PuchaseOptions,
} from "../premises.entity";

export class PremisesDto {
	@ApiProperty({
		enum: PremisesType,
		required: true,
	})
	@IsOptional()
	type!: PremisesType | undefined;

	@ApiProperty({ example: 1 })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	building_id?: number;

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
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	section_id?: number;

	@ApiProperty({ description: "Purchase option", required: false })
	@IsOptional()
	@IsEnum(PuchaseOptions)
	purchaseOption?: PuchaseOptions;
}
