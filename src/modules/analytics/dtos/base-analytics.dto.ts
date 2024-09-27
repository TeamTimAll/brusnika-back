import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { Limit, Page } from "../../../decorators";

export class BaseAnalyticsDto {
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

	@ApiPropertyOptional()
	@Page()
	page: number = 1;

	@ApiPropertyOptional()
	@Limit()
	limit: number = 50;
}
