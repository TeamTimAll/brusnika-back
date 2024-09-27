import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

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

	@ApiPropertyOptional({ default: 1, description: "The id of the city" })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}
