import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class RecommendedEventDto {
	@ApiProperty()
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	event_id!: number;

	@ApiProperty({ required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}
