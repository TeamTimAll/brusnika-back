import { IsNumber, IsOptional, IsString } from "class-validator";

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
