import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

import { Limit, Page } from "../../../decorators";

export class ManagerAnalyticsDto {
	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	toDate!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	fromDate!: Date;

	@ApiPropertyOptional()
	@Page()
	page: number = 1;

	@ApiPropertyOptional()
	@Limit()
	limit: number = 50;
}
