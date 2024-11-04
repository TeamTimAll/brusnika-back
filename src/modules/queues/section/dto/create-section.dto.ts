import { IsOptional, IsString } from "class-validator";

export class SectionDto {
	@IsString()
	ext_id!: string;

	@IsString()
	name!: string;

	@IsString()
	@IsOptional()
	building_ext_id?: string;
}
