import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

import { RoleType } from "../../../constants";

export class UsersAnalyticsDto {
	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	toDate!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	fromDate!: Date;

	@ApiPropertyOptional({ enum: RoleType })
	@IsOptional()
	@IsEnum(RoleType)
	role?: RoleType;
}
