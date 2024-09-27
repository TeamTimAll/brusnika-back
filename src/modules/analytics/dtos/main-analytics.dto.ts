import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class MainAnalyticsDto {
	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	toDate!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	fromDate!: Date;

	@ApiPropertyOptional({ default: 1, description: "The id of the city" })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}
