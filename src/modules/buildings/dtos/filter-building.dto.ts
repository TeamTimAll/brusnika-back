import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class FilterBuildingDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	project_id?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	city_id?: number;
}
