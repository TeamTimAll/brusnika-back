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
import { UserFilterByDateEnum } from "../types/user-by-date.type";

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

export class UsersByCityAnalyticsDto {
	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	toDate!: Date;

	@ApiProperty()
	@IsDateString()
	@IsNotEmpty()
	fromDate!: Date;

	@ApiPropertyOptional({ enum: UserFilterByDateEnum })
	@IsOptional()
	@IsEnum(UserFilterByDateEnum)
	type?: UserFilterByDateEnum;
}
