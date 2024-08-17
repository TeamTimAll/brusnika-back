import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
} from "class-validator";

import { RoleType } from "../../../constants";
import { Limit, Page } from "../../../decorators";

export class UserFilterDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	fullname?: string;

	@ApiProperty({ required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;

	@ApiProperty({ enum: RoleType, required: false })
	@IsEnum(RoleType)
	@IsOptional()
	role?: RoleType;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	registered_at?: string;

	@ApiProperty({ required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	agency_id?: number;
}
