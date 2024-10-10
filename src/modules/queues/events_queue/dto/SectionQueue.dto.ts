import { IsOptional, IsString } from "class-validator";

export class SectionQueueDto {
	@IsString()
	ext_id!: string;

	@IsString()
	name!: string;

	@IsString()
	@IsOptional()
	building_ext_id?: string;
}
