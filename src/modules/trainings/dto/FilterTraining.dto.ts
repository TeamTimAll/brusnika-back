import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class FilterTrainingDto {
	@ApiProperty({ required: false })
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	category_id?: number;
}
