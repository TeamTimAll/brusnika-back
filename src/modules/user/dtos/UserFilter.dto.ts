import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
} from "class-validator";

import { Order, RoleType } from "../../../constants";
import { Limit, Page } from "../../../decorators";

export enum UserSortBy {
	FULLNAME = "fullname",
	AGENCY_NAME = "agency_name",
	ROLE = "role",
	CITY_NAME = "city_name",
	STATUS = "status",
	REGISTERED_AT = "registered_at",
}

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

	@ApiProperty({ enum: UserSortBy, required: false })
	@IsEnum(UserSortBy)
	@IsOptional()
	sort_by?: UserSortBy;

	@ApiProperty({ enum: Order, required: false })
	@IsEnum(Order)
	@IsOptional()
	order_by?: Order = Order.ASC;
}
