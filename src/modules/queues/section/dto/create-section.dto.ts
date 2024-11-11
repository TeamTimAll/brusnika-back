import { Type } from "class-transformer";
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

export class SectionDto {
	@IsString()
	ext_id!: string;

	@IsString()
	name!: string;

	@IsNumber()
	number_of_floors!: number;

	@IsString()
	@IsOptional()
	building_ext_id?: string;
}

export class SectionsDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => SectionDto)
	sections!: SectionDto[];
}
