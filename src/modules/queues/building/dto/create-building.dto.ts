import { Type } from "class-transformer";
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

export class BuildingDto {
	@IsString()
	@IsNotEmpty()
	ext_id!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	address!: string;

	@IsNumber()
	@IsNotEmpty()
	number_of_floors!: number;

	@IsOptional()
	@IsString({ each: true })
	photos!: string[];

	@IsString()
	@IsNotEmpty()
	project_ext_id!: string;
}

export class BuildingsDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => BuildingDto)
	data!: BuildingDto[];
}
