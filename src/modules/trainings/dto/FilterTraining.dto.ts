import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class FilterTrainingDto {
	@ApiProperty({ required: false })
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	category_id?: number;
}
