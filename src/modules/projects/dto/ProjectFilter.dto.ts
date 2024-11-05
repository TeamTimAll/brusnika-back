import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class ProjectFilterDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	city_id?: number;
}
