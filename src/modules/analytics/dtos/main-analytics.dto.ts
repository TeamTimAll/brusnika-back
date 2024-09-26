import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class MainAnalyticsDto {
	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	toDate!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	fromDate!: Date;
}
